import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-ignore - sql.js does not have types
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Types ────────────────────────────────────────────────────────────────────
export type AgentId = 'glm' | 'kimi' | 'antigravity' | 'groq' | 'claude' | 'siliconflow' | 'cohere';
export type TaskStatus = 'active' | 'done' | 'error' | 'rotated';
export type AccountStatus = 'ready' | 'active' | 'cooling' | 'exhausted';

export interface Task {
  id: string;
  agent: AgentId;
  text: string;
  status: TaskStatus;
  result: string | null;
  ts: number;
}

export interface Account {
  id: string;
  agent: AgentId;
  label: string;
  key_encrypted: string;
  status: AccountStatus;
  usage_tokens: number;
  limit_tokens: number;
  rotations: number;
  last_reset: number;
}

export interface AgentState {
  agent: AgentId;
  active: number;
  last_task_id: string | null;
}

// ── Encryption ───────────────────────────────────────────────────────────────
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET ?? 'dev-secret-change-in-prod-32ch!!';
const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(ENCRYPTION_SECRET)
  .digest();

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, dataHex] = encryptedText.split(':');
  if (!ivHex || !tagHex || !dataHex) throw new Error('Invalid encrypted format');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const data = Buffer.from(dataHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data) + decipher.final('utf8');
}

export function getDecryptedKey(account: Account): string {
  return decrypt(account.key_encrypted);
}

// ── Database ─────────────────────────────────────────────────────────────────
let _db: any;

async function initializeDB() {
  const SQL = await initSqlJs();
  _db = new SQL.Database();
  
  _db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      agent TEXT NOT NULL,
      text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      result TEXT,
      ts INTEGER NOT NULL DEFAULT (cast(julianday('now') * 86400000 as integer))
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      agent TEXT NOT NULL,
      label TEXT NOT NULL,
      key_encrypted TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      usage_tokens INTEGER NOT NULL DEFAULT 0,
      limit_tokens INTEGER NOT NULL DEFAULT 1000000,
      rotations INTEGER NOT NULL DEFAULT 0,
      last_reset INTEGER NOT NULL DEFAULT (cast(julianday('now') * 86400000 as integer))
    );

    CREATE TABLE IF NOT EXISTS agent_state (
      agent TEXT PRIMARY KEY,
      active INTEGER NOT NULL DEFAULT 0,
      last_task_id TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_ts ON tasks(ts DESC);
    CREATE INDEX IF NOT EXISTS idx_accounts_agent ON accounts(agent, status);
  `);

  const AGENT_IDS: AgentId[] = ['glm', 'kimi', 'antigravity', 'groq', 'claude', 'siliconflow', 'cohere'];
  for (const id of AGENT_IDS) {
    _db.run(`INSERT OR IGNORE INTO agent_state (agent, active, last_task_id) VALUES (?, 0, NULL)`, [id]);
  }

  console.log(`✅ Database initialized (in-memory with sql.js)`);
  return _db;
}

// Initialize on module load
export const dbPromise = initializeDB();
export const db = await dbPromise;

// ── Query helpers ────────────────────────────────────────────────────────────
export const queries = {
  task: {
    create: (id: string, agent: string, text: string) =>
      db.run(`INSERT INTO tasks (id, agent, text, status) VALUES (?, ?, ?, 'active')`, [id, agent, text]),
    update: (status: TaskStatus, result: string | null, id: string) =>
      db.run(`UPDATE tasks SET status = ?, result = ? WHERE id = ?`, [status, result, id]),
    getById: (id: string) => {
      const stmt = db.prepare(`SELECT * FROM tasks WHERE id = ?`);
      const result = stmt.getAsObject([id]);
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    getByAgent: (agent: string) => {
      const stmt = db.prepare(`SELECT * FROM tasks WHERE agent = ? ORDER BY ts DESC LIMIT 100`);
      const result = stmt.getAsObject([agent]);
      return Array.isArray(result) ? result : [];
    },
    getAll: () => {
      const stmt = db.prepare(`SELECT * FROM tasks ORDER BY ts DESC LIMIT 500`);
      const result = stmt.getAsObject();
      return Array.isArray(result) ? result : [];
    },
  },
  account: {
    create: (id: string, agent: string, label: string, key_encrypted: string, limit_tokens: number) =>
      db.run(
        `INSERT INTO accounts (id, agent, label, key_encrypted, limit_tokens) VALUES (?, ?, ?, ?, ?)`,
        [id, agent, label, key_encrypted, limit_tokens]
      ),
    getByAgent: (agent: string) => {
      const stmt = db.prepare(`SELECT * FROM accounts WHERE agent = ? ORDER BY status ASC`);
      const result = stmt.getAsObject([agent]);
      return Array.isArray(result) ? result : [];
    },
    getReady: (agent: string) => {
      const stmt = db.prepare(`SELECT * FROM accounts WHERE agent = ? AND status = 'ready' LIMIT 1`);
      const result = stmt.getAsObject([agent]);
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    update: (status: AccountStatus, usage_tokens: number, rotations: number, id: string) =>
      db.run(
        `UPDATE accounts SET status = ?, usage_tokens = ?, rotations = ? WHERE id = ?`,
        [status, usage_tokens, rotations, id]
      ),
    getAll: () => {
      const stmt = db.prepare(`SELECT * FROM accounts`);
      const result = stmt.getAsObject();
      return Array.isArray(result) ? result : [];
    },
  },
  state: {
    get: (agent: string) => {
      const stmt = db.prepare(`SELECT * FROM agent_state WHERE agent = ?`);
      const result = stmt.getAsObject([agent]);
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    update: (active: number, last_task_id: string | null, agent: string) =>
      db.run(`UPDATE agent_state SET active = ?, last_task_id = ? WHERE agent = ?`, [active, last_task_id, agent]),
  },
};

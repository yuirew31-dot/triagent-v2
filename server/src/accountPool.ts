import { queries, Account, encrypt, decrypt, getDecryptedKey } from './db.js';
import { broadcastStateUpdate } from './ws.js';

interface RotationState {
  [key: string]: {
    currentIndex: number;
    lastRotation: number;
    cooldownEnd: number;
  };
}

const rotationState: RotationState = {};

export async function getActiveKey(agent: string): Promise<string | null> {
  const account = queries.account.getReady(agent);
  if (!account) return null;
  return getDecryptedKey(account);
}

export function rotate(agent: string): void {
  const accounts = queries.account.getByAgent(agent) as Account[];
  if (accounts.length === 0) return;

  // Find next ready account or mark for cooldown
  const currentReady = accounts.find(a => a.status === 'ready');
  if (currentReady) {
    queries.account.update('cooling', currentReady.usage_tokens, currentReady.rotations + 1, currentReady.id);
  }

  const nextReady = accounts.find(a => a.status === 'cooling' || a.status === 'exhausted');
  if (nextReady && nextReady.status === 'cooling') {
    queries.account.update('ready', nextReady.usage_tokens, nextReady.rotations, nextReady.id);
  }

  broadcastStateUpdate({
    event: 'account_rotated',
    agent,
    timestamp: Date.now(),
  });
}

export async function addAccount(
  agent: string,
  apiKey: string,
  label: string,
  limitTokens: number = 1000000
): Promise<Account> {
  const account: Account = {
    id: `${agent}_${Date.now()}`,
    agent: agent as any,
    label,
    key_encrypted: encrypt(apiKey),
    status: 'ready',
    usage_tokens: 0,
    limit_tokens: limitTokens,
    rotations: 0,
    last_reset: Math.floor(Date.now() / 1000),
  };

  queries.account.create(
    account.id,
    account.agent,
    account.label,
    account.key_encrypted,
    account.limit_tokens
  );

  return account;
}

export function updateTokenUsage(accountId: string, tokens: number): void {
  // TODO: Implement token usage tracking
}

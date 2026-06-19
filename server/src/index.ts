import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { setupWS } from './ws.js';
import { queries, Task } from './db.js';
import { addAccount } from './accountPool.js';
import { smartOrchestrate, getUsageMetrics, compressContextManually } from './smart-orchestrator.js';
import { v4 as uuid } from 'uuid';

const PORT = parseInt(process.env.PORT || '3000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://triagent-dashboard.onrender.com'
];

const fastify = Fastify({ logger: true });

// ── CORS ──────────────────────────────────────────────────────────────────────
await fastify.register(fastifyCors, {
  origin: CORS_ORIGIN,
  credentials: true,
});

// ── WebSocket ─────────────────────────────────────────────────────────────────
await setupWS(fastify);

// ── REST API ──────────────────────────────────────────────────────────────────

// Get all tasks
fastify.get('/api/tasks', async (request, reply) => {
  const tasks = queries.task.getAll();
  return tasks;
});

// Get tasks by agent
fastify.get('/api/tasks/:agent', async (request, reply) => {
  const { agent } = request.params as { agent: string };
  const tasks = queries.task.getByAgent(agent);
  return tasks;
});

// Create task (Smart Orchestration)
fastify.post('/api/tasks', async (request, reply) => {
  const { prompt } = request.body as { prompt: string };

  if (!prompt || typeof prompt !== 'string') {
    return reply.status(400).send({ error: 'prompt (string) required' });
  }

  const task: Task = {
    id: uuid(),
    agent: 'claude', // Will be overridden by smart orchestrator
    text: prompt,
    status: 'active',
    result: null,
    ts: Math.floor(Date.now() / 1000),
  };

  queries.task.create(task.id, task.agent, task.text);

  // Start smart orchestration in background
  setImmediate(() => smartOrchestrate(task.id, prompt));

  return { taskId: task.id };
});

// Add account
fastify.post('/api/account/add', async (request, reply) => {
  const { agent, apiKey, label, limitTokens } = request.body as {
    agent: string;
    apiKey: string;
    label: string;
    limitTokens?: number;
  };

  if (!agent || !apiKey || !label) {
    return reply.status(400).send({ error: 'agent, apiKey, and label required' });
  }

  try {
    const account = await addAccount(agent, apiKey, label, limitTokens);
    return { success: true, id: account.id };
  } catch (error) {
    return reply.status(500).send({ error: String(error) });
  }
});

// Get accounts by agent
fastify.get('/api/accounts/:agent', async (request, reply) => {
  const { agent } = request.params as { agent: string };
  const accounts = queries.account.getByAgent(agent);
  return accounts.map(a => ({
    ...a,
    key_encrypted: undefined, // Never expose encrypted keys
  }));
});

// Get all accounts
fastify.get('/api/accounts', async (request, reply) => {
  const accounts = queries.account.getAll();
  return accounts.map(a => ({
    ...a,
    key_encrypted: undefined,
  }));
});

// ── SMART ORCHESTRATOR METRICS ────────────────────────────────────────────────

/**
 * Get usage metrics (costs, cache hits, performance)
 * Endpoint: GET /api/metrics
 */
fastify.get('/api/metrics', async (request, reply) => {
  return getUsageMetrics();
});

/**
 * Compress context manually (for debugging)
 * Endpoint: POST /api/compress
 * Body: { context: string }
 */
fastify.post('/api/compress', async (request, reply) => {
  const { context } = request.body as { context: string };
  
  if (!context || typeof context !== 'string') {
    return reply.status(400).send({ error: 'context (string) required' });
  }

  try {
    const compressed = await compressContextManually(context);
    return {
      original: { length: context.length },
      compressed: { length: compressed.length },
      compressionRatio: (compressed.length / context.length * 100).toFixed(2) + '%',
      result: compressed,
    };
  } catch (error) {
    return reply.status(500).send({ error: String(error) });
  }
});

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: Date.now() };
});

// ── START SERVER ──────────────────────────────────────────────────────────────
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🚀 Server running on http://localhost:${PORT}`);
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}

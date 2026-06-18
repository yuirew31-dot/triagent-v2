import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import fastifyWebsocket from '@fastify/websocket';
import { v4 as uuid } from 'uuid';
import { db, queries, Task, Account, encrypt } from './db.js';

const clients: Map<string, WebSocket> = new Map();

export async function setupWS(fastify: FastifyInstance) {
  await fastify.register(fastifyWebsocket);

  fastify.get('/ws', { websocket: true }, async (socket: WebSocket, request: FastifyRequest) => {
    const clientId = uuid();
    clients.set(clientId, socket);
    console.log(`[WS] Client connected: ${clientId}`);

    socket.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        await handleMessage(clientId, message, socket);
      } catch (error) {
        console.error('[WS] Parse error:', error);
      }
    });

    socket.on('close', () => {
      clients.delete(clientId);
      console.log(`[WS] Client disconnected: ${clientId}`);
    });

    // Send initial state
    const accounts = queries.account.getAll();
    socket.send(JSON.stringify({
      type: 'state:accounts',
      data: accounts.map((a: Account) => ({
        ...a,
        key_encrypted: undefined, // Never send encrypted keys to client
      })),
    }));
  });
}

async function handleMessage(clientId: string, message: any, socket: WebSocket) {
  const { type, data } = message;

  switch (type) {
    case 'task:create': {
      const task: Task = {
        id: uuid(),
        agent: data.agent,
        text: data.text,
        status: 'active',
        result: null,
        ts: Math.floor(Date.now() / 1000),
      };
      queries.task.create(task.id, task.agent, task.text);
      broadcastTaskUpdate(task.id, 'active', 'Task queued');
      break;
    }
    case 'account:list': {
      const accounts = queries.account.getByAgent(data.agent);
      socket.send(JSON.stringify({ type: 'account:list', agent: data.agent, accounts }));
      break;
    }
  }
}

export function broadcastTaskUpdate(taskId: string, status: string, result: string) {
  const message = JSON.stringify({ type: 'task:update', taskId, status, result });
  clients.forEach(ws => {
    if (ws.readyState === 1) ws.send(message);
  });
}

export function broadcastTaskChunk(taskId: string, chunk: string) {
  const message = JSON.stringify({ type: 'task:chunk', taskId, chunk });
  clients.forEach(ws => {
    if (ws.readyState === 1) ws.send(message);
  });
}

export function broadcastStateUpdate(state: any) {
  const message = JSON.stringify({ type: 'state:update', data: state });
  clients.forEach(ws => {
    if (ws.readyState === 1) ws.send(message);
  });
}

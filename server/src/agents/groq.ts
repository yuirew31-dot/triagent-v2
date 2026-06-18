import Anthropic from '@anthropic-ai/sdk';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';
import { getActiveKey, rotate } from '../accountPool.js';

/**
 * Groq (#1 Speed) — Relay only: сжатие контекста, передача между агентами
 * Используется для быстрых промежуточных операций
 */

export async function runGroqRelay(taskId: string, prompt: string): Promise<void> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'Groq API key not configured');
    return;
  }

  try {
    const client = new Anthropic({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const stream = await client.messages.stream({
      model: 'mixtral-8x7b-32768',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    let fullText = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && 'delta' in event && event.delta.type === 'text_delta') {
        const delta = event.delta as any;
        fullText += delta.text;
        broadcastTaskChunk(taskId, delta.text);
      }
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    broadcastTaskUpdate(taskId, 'error', `Groq error: ${message}`);
  }
}

/**
 * Compress context using Groq (fast + cheap)
 * Input: ~100K tokens → Output: ~500 tokens (summary)
 */
export async function compressContext(context: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return context;

  try {
    const client = new Anthropic({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const response = await client.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Compress this context into key points (500 tokens max):\n\n${context}`
      }],
    });

    const textContent = response.content.find(c => c.type === 'text');
    return (textContent && 'text' in textContent) ? textContent.text : context;
  } catch (error) {
    console.error('[Groq] Compression error:', error);
    return context;
  }
}

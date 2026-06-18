import { GoogleGenerativeAI } from '@google/generative-ai';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';
import { getActiveKey, rotate } from '../accountPool.js';
import { apiRateLimiter } from '../rateLimiter.js';

/**
 * Google Gemini 3.5 Flash — Analytics / Math / Creative
 * Arena Leaderboard: #13 Text, #1 Math
 * Бесплатно через Google AI Studio (50 req/min)
 * 
 * Fallback цепочка:
 * 1. Gemini 3.5 Flash (основной)
 * 2. Gemini 3 Flash (#20 Text)
 * 3. Groq Relay
 */

export async function runGemini35Flash(taskId: string, prompt: string): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY_1;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'Gemini API key not configured');
    return;
  }

  if (!apiRateLimiter.gemini.isAllowed('gemini')) {
    broadcastTaskUpdate(taskId, 'error', `Gemini rate limit exceeded. Remaining: ${apiRateLimiter.gemini.getRemaining('gemini')}`);
    rotate('antigravity');
    return;
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const stream = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      fullText += text;
      broadcastTaskChunk(taskId, text);
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('429') || message.includes('quota')) {
      console.warn(`[Gemini] Rate limit hit`);
      rotate('antigravity');
      return;
    }

    broadcastTaskUpdate(taskId, 'error', `Gemini error: ${message}`);
  }
}

export async function runGemini3Flash(taskId: string, prompt: string): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_1;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'Gemini API key not configured');
    return;
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-3-flash' });

    const stream = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      fullText += text;
      broadcastTaskChunk(taskId, text);
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    broadcastTaskUpdate(taskId, 'error', `Gemini Fallback error: ${message}`);
  }
}

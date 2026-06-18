import Anthropic from '@anthropic-ai/sdk';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';
import { getActiveKey, rotate } from '../accountPool.js';
import { apiRateLimiter } from '../rateLimiter.js';

/**
 * Kimi K2.7 — Backend / Architecture / Long Context
 * Arena Leaderboard: #7 Image-to-WebDev, #13 Math
 * Поддерживает 200K токенов в контексте
 * 
 * Fallback цепочка:
 * 1. Fireworks AI Kimi K2.7 ($6.00) — с Prompt Caching
 * 2. SiliconFlow DeepSeek-V3 (бесплатно)
 * 3. Groq Relay
 */

export async function runKimiFireworks(taskId: string, prompt: string): Promise<void> {
  // Try account pool first, then fallback to .env
  let apiKey = getActiveKey('kimi');
  if (!apiKey) {
    apiKey = process.env.FIREWORKS_API_KEY;
  }
  
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'No Kimi API keys available');
    return;
  }

  if (!apiRateLimiter.fireworks.isAllowed('kimi')) {
    broadcastTaskUpdate(taskId, 'error', 'Fireworks rate limit exceeded');
    return;
  }

  try {
    const client = new Anthropic({
      apiKey,
      baseURL: 'https://api.fireworks.ai/inference/v1',
    });

    const stream = await client.messages.stream({
      model: 'accounts/fireworks/models/kimi-k2-7',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      system: [{
        type: "text",
        text: "You are an expert backend architect and system designer. Design scalable, robust systems with long-term thinking.",
        cache_control: { type: "ephemeral" }
      } as any],
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

    if (message.includes('429') || message.includes('quota')) {
      console.warn(`[Kimi] Rate limit or quota hit`);
      rotate('kimi');
      return;
    }

    broadcastTaskUpdate(taskId, 'error', `Kimi error: ${message}`);
  }
}

export async function runKimiDeepSeek(taskId: string, prompt: string): Promise<void> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'SiliconFlow not configured');
    return;
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek error: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const text = json.choices?.[0]?.delta?.content || '';
            if (text) {
              fullText += text;
              broadcastTaskChunk(taskId, text);
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    broadcastTaskUpdate(taskId, 'error', `DeepSeek error: ${message}`);
  }
}

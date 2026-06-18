import Anthropic from '@anthropic-ai/sdk';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';
import { getActiveKey, rotate } from '../accountPool.js';
import { apiRateLimiter } from '../rateLimiter.js';

/**
 * GLM 5.2 — Frontend / UI / Coding
 * Arena Leaderboard: #9 WebDev, #9 Coding
 * 
 * Fallback цепочка:
 * 1. Fireworks AI ($6.00) — Prompt Caching для экономии
 * 2. SiliconFlow GLM-4-9B (бесплатно)
 * 3. Ollama GLM-4 (local)
 * 4. Groq Relay
 */

export async function runGLMFireworks(taskId: string, prompt: string): Promise<void> {
  // Try account pool first, then fallback to .env
  let apiKey = getActiveKey('glm');
  if (!apiKey) {
    apiKey = process.env.FIREWORKS_API_KEY;
  }
  
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'No GLM API keys available');
    return;
  }

  if (!apiRateLimiter.fireworks.isAllowed('glm')) {
    broadcastTaskUpdate(taskId, 'error', 'Fireworks rate limit exceeded');
    return;
  }

  try {
    const client = new Anthropic({
      apiKey,
      baseURL: 'https://api.fireworks.ai/inference/v1',
    });

    console.log(`[GLM] Creating stream for task ${taskId}...`);
    const stream = await client.messages.stream({
      model: 'accounts/fireworks/models/glm-5-2',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: [{
        type: "text",
        text: "You are a world-class frontend developer. Create beautiful, interactive UIs with React and Tailwind CSS.",
        cache_control: { type: "ephemeral" }
      } as any],
    });

    console.log(`[GLM] Stream created for task ${taskId}`);
    let fullText = '';
    let chunkCount = 0;
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && 'delta' in event && event.delta.type === 'text_delta') {
        const delta = event.delta as any;
        fullText += delta.text;
        chunkCount++;
        console.log(`[GLM] Chunk ${chunkCount} for ${taskId}: ${delta.text.substring(0, 30)}...`);
        broadcastTaskChunk(taskId, delta.text);
      }
    }

    console.log(`[GLM] Task ${taskId} done. Total chunks: ${chunkCount}, fullText length: ${fullText.length}`);
    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('429') || message.includes('quota')) {
      console.warn(`[GLM] Rate limit or quota hit`);
      rotate('glm');
      return;
    }

    broadcastTaskUpdate(taskId, 'error', `GLM error: ${message}`);
  }
}

export async function runGLMSiliconFlow(taskId: string, prompt: string): Promise<void> {
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
        model: 'Qwen/Qwen-2.5-72B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`SiliconFlow error: ${response.status}`);
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
    broadcastTaskUpdate(taskId, 'error', `SiliconFlow error: ${message}`);
  }
}

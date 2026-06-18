import Anthropic from '@anthropic-ai/sdk';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';
import { getActiveKey, rotate } from '../accountPool.js';

/**
 * Claude Sonnet — Secondary / QA / Refactor
 * Arena Leaderboard: #10 Text
 * Платный, экономим (только для сложного анализа)
 */

export async function runClaudeSonnet(taskId: string, prompt: string): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[Claude] API key not configured');
    broadcastTaskUpdate(taskId, 'error', 'Claude API key not configured');
    return;
  }

  try {
    console.log(`[Claude] Starting task ${taskId}...`);
    const client = new Anthropic({ apiKey });

    const stream = await client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    console.log(`[Claude] Stream created for ${taskId}`);
    let fullText = '';
    let chunkCount = 0;
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && 'delta' in event && event.delta.type === 'text_delta') {
        const delta = event.delta as any;
        fullText += delta.text;
        chunkCount++;
        console.log(`[Claude] Chunk ${chunkCount} for ${taskId}: ${delta.text.substring(0, 30)}...`);
        broadcastTaskChunk(taskId, delta.text);
      }
    }

    console.log(`[Claude] Task ${taskId} done. Total chunks: ${chunkCount}, fullText length: ${fullText.length}`);
    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Claude] Error for task ${taskId}:`, message);
    broadcastTaskUpdate(taskId, 'error', `Claude error: ${message}`);
  }
}

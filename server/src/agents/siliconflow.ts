import fetch from 'node-fetch';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

/**
 * SiliconFlow - FREE & CHEAP Models
 * Бесплатные модели: Qwen-72B, DeepSeek-V3, Qwen-Coder
 * Платные (дешевле): GLM-4-9B
 * 
 * API Docs: https://docs.siliconflow.cn/
 */

export const SILICONFLOW_MODELS = {
  'qwen-72b': 'Qwen/Qwen-2.5-72B-Instruct',
  'deepseek-v3': 'deepseek-ai/DeepSeek-V3',
  'qwen-coder': 'Qwen/Qwen-2.5-Coder-32B-Instruct',
  'qwen-quantum': 'Qwen/Qwen-2.5-Quantum-Instruct',
  'glm-4-9b': 'THUDM/glm-4-9b-chat',
} as const;

export type SiliconFlowModel = keyof typeof SILICONFLOW_MODELS;

/**
 * Основная функция для выполнения запроса к SiliconFlow
 * @param taskId - ID задачи для отправки обновлений
 * @param prompt - Текст запроса
 * @param model - Модель (по умолчанию qwen-72b)
 * @param options - Дополнительные параметры
 */
export async function runSiliconFlow(
  taskId: string,
  prompt: string,
  model: SiliconFlowModel = 'qwen-72b',
  options?: {
    temperature?: number;
    max_tokens?: number;
    system?: string;
  }
): Promise<void> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'SiliconFlow API key missing - set SILICONFLOW_API_KEY in .env');
    return;
  }

  const modelPath = SILICONFLOW_MODELS[model];
  if (!modelPath) {
    broadcastTaskUpdate(taskId, 'error', `Unknown model: ${model}`);
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
        model: modelPath,
        messages: [
          ...(options?.system ? [{ role: 'system', content: options.system }] : []),
          { role: 'user', content: prompt }
        ],
        stream: true,
        max_tokens: options?.max_tokens || 4096,
        temperature: options?.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SiliconFlow HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let hasStarted = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const text = json.choices?.[0]?.delta?.content || '';
          
          if (text) {
            if (!hasStarted) {
              hasStarted = true;
              broadcastTaskChunk(taskId, `[SiliconFlow / ${model}]\n`);
            }
            fullText += text;
            broadcastTaskChunk(taskId, text);
          }
        } catch (e) {
          // Ignore JSON parse errors for this line
          console.warn(`[SiliconFlow] Failed to parse: ${data}`);
        }
      }
    }

    if (!fullText) {
      broadcastTaskUpdate(taskId, 'error', 'Empty response from SiliconFlow');
      return;
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[SiliconFlow]', message);
    broadcastTaskUpdate(taskId, 'error', `SiliconFlow error: ${message}`);
  }
}

/**
 * Сокращенные функции для конкретных моделей
 */

export async function runQwen72B(
  taskId: string,
  prompt: string,
  system?: string
): Promise<void> {
  return runSiliconFlow(taskId, prompt, 'qwen-72b', { system });
}

export async function runDeepSeekV3(
  taskId: string,
  prompt: string,
  system?: string
): Promise<void> {
  return runSiliconFlow(taskId, prompt, 'deepseek-v3', { system });
}

export async function runQwenCoder(
  taskId: string,
  prompt: string,
  system?: string
): Promise<void> {
  return runSiliconFlow(taskId, prompt, 'qwen-coder', { system });
}

/**
 * Проверить статус API (тестовый запрос)
 */
export async function checkSiliconFlowStatus(): Promise<{
  available: boolean;
  message: string;
  model?: string;
}> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  
  if (!apiKey) {
    return {
      available: false,
      message: 'SILICONFLOW_API_KEY not set in environment'
    };
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
        messages: [{ role: 'user', content: 'Hello' }],
        stream: false,
        max_tokens: 10,
      }),
    });

    if (response.ok) {
      return {
        available: true,
        message: 'SiliconFlow API is working',
        model: 'Qwen-72B'
      };
    } else {
      return {
        available: false,
        message: `API returned ${response.status}`
      };
    }
  } catch (error) {
    return {
      available: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

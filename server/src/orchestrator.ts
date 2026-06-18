import { broadcastTaskUpdate } from './ws.js';
import { queries, Task } from './db.js';
import { runGLMFireworks, runGLMSiliconFlow } from './agents/glm.js';
import { runKimiFireworks, runKimiDeepSeek } from './agents/kimi.js';
import { runGemini35Flash, runGemini3Flash } from './agents/antigravity.js';
import { runCohereSearch } from './agents/cohere-rag.js';
import { runGroqRelay, compressContext } from './agents/groq.js';
import { runClaudeSonnet } from './agents/claude.js';

/**
 * ORCHESTRATOR — Умное распределение задач по агентам
 * 
 * Алгоритм:
 * 1. Анализ типа задачи (frontend, backend, math, research, creative)
 * 2. Выбор приоритетного агента
 * 3. Fallback цепочка при ошибке
 */

export async function orchestrate(task: Task): Promise<void> {
  try {
    const { id, agent, text } = task;

    console.log(`[Orchestrator] Running task: ${id} (agent: ${agent})`);

    switch (agent) {
      case 'glm':
        await runGLMFireworks(id, text).catch(async () => {
          console.log('[Orchestrator] GLM Fireworks failed, trying SiliconFlow...');
          await runGLMSiliconFlow(id, text);
        });
        break;

      case 'kimi':
        await runKimiFireworks(id, text).catch(async () => {
          console.log('[Orchestrator] Kimi Fireworks failed, trying DeepSeek...');
          await runKimiDeepSeek(id, text);
        });
        break;

      case 'antigravity':
        await runGemini35Flash(id, text).catch(async () => {
          console.log('[Orchestrator] Gemini 3.5 Flash failed, trying Gemini 3 Flash...');
          await runGemini3Flash(id, text);
        });
        break;

      case 'groq':
        await runGroqRelay(id, text);
        break;

      case 'claude':
        await runClaudeSonnet(id, text);
        break;

      case 'siliconflow':
        // Default to Qwen
        await runGLMSiliconFlow(id, text);
        break;

      case 'cohere':
        // For Cohere, we need documents passed separately
        // For now, treat as regular GLM fallback
        await runGLMSiliconFlow(id, text);
        break;

      default:
        broadcastTaskUpdate(id, 'error', `Unknown agent: ${agent}`);
    }
  } catch (error) {
    console.error('[Orchestrator] Unhandled error:', error);
    broadcastTaskUpdate(task.id, 'error', `Orchestration failed: ${error}`);
  }
}

/**
 * Smart agent selection based on task analysis
 */
export async function selectAgent(prompt: string): Promise<'glm' | 'kimi' | 'antigravity'> {
  const keywords = {
    frontend: ['ui', 'react', 'component', 'button', 'form', 'interface', 'css', 'html'],
    backend: ['api', 'server', 'database', 'architecture', 'microservice', 'endpoint', 'controller'],
    math: ['math', 'calculate', 'algorithm', 'statistics', 'formula', 'number'],
  };

  const lowerPrompt = prompt.toLowerCase();

  let frontendScore = 0, backendScore = 0, mathScore = 0;

  for (const key of keywords.frontend) {
    if (lowerPrompt.includes(key)) frontendScore++;
  }
  for (const key of keywords.backend) {
    if (lowerPrompt.includes(key)) backendScore++;
  }
  for (const key of keywords.math) {
    if (lowerPrompt.includes(key)) mathScore++;
  }

  if (mathScore > frontendScore && mathScore > backendScore) {
    return 'antigravity'; // Gemini 3.5 Flash is #1 in Math
  } else if (backendScore > frontendScore) {
    return 'kimi';         // Kimi for architecture
  } else {
    return 'glm';          // GLM for frontend
  }
}

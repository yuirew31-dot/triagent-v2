import { CohereClient } from 'cohere-ai';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

/**
 * Cohere RAG — Semantic Search / Knowledge Retrieval
 * Trial API Key (бесплатно для разработки)
 * Модели: Command R, Command R+, Embed-v3, Rerank-v3
 */

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magnitude = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0)) * 
                    Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  return dotProduct / magnitude || 0;
}

export async function runCohereSearch(taskId: string, query: string, documents: string[]): Promise<void> {
  try {
    if (documents.length === 0) {
      broadcastTaskUpdate(taskId, 'error', 'No documents provided');
      return;
    }

    // Semantic search с rerank
    const embedResponse = await cohere.embed({
      texts: [query, ...documents.slice(0, 50)], // Limit to 50 docs for demo
      model: 'embed-english-v3.0',
      inputType: 'search_query',
    });

    const embeddings = Array.isArray(embedResponse.embeddings) 
      ? embedResponse.embeddings 
      : (embedResponse.embeddings as any).texts || [];
    
    const queryEmbedding = (embeddings as number[][])[0];
    const docEmbeddings = (embeddings as number[][]).slice(1);

    // Compute similarities
    const scores = docEmbeddings.map((doc: number[], i: number) => ({
      index: i,
      score: cosineSimilarity(queryEmbedding, doc),
      text: documents[i]
    }));

    const topResults = scores
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3)
      .map((r: any) => r.text);

    // RAG через Command R
    const ragPrompt = `Use these documents to answer the user's question:

QUERY: ${query}

DOCUMENTS:
${topResults.map((doc: string, i: number) => `${i + 1}. ${doc}`).join('\n\n')}

Provide a concise answer based on the documents above.`;

    broadcastTaskChunk(taskId, 'Starting RAG with Command R...\n\n');

    try {
      const chatResponse = await cohere.chatStream({
        message: ragPrompt,
        model: 'command-r-v1:0',
      });

      let fullText = '';
      for await (const event of chatResponse) {
        if (event.eventType === 'text-generation') {
          const text = (event as any).text || '';
          fullText += text;
          broadcastTaskChunk(taskId, text);
        }
      }

      broadcastTaskUpdate(taskId, 'done', fullText);
    } catch (chatError) {
      // Fallback: just return top results
      const fallbackText = topResults.join('\n\n---\n\n');
      broadcastTaskChunk(taskId, '\n[Fallback: Returning top search results]\n\n');
      broadcastTaskUpdate(taskId, 'done', fallbackText);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Cohere] Error:', message);
    broadcastTaskUpdate(taskId, 'error', `Cohere error: ${message}`);
  }
}

export async function runCohereRAG(taskId: string, query: string, documents: string[]): Promise<void> {
  await runCohereSearch(taskId, query, documents);
}

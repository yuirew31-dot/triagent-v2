export type TaskStatus = 'active' | 'done' | 'error' | 'rotated';
export type AccountStatus = 'ready' | 'active' | 'cooling' | 'exhausted';
export type AgentId = 'glm' | 'kimi' | 'antigravity' | 'groq' | 'claude' | 'siliconflow' | 'cohere';

export interface Task {
  id: string;
  agent: AgentId;
  text: string;
  status: TaskStatus;
  result: string | null;
  ts: number;
}

export interface Account {
  id: string;
  agent: AgentId;
  label: string;
  status: AccountStatus;
  usage_tokens: number;
  limit_tokens: number;
  rotations: number;
  last_reset: number;
}

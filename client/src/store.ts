import { create } from 'zustand';
import { Task, Account } from '../types';

interface Store {
  tasks: Task[];
  accounts: Record<string, Account[]>;
  activeAgent: string;
  
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setAccounts: (agent: string, accounts: Account[]) => void;
  setActiveAgent: (agent: string) => void;
}

export const useStore = create<Store>((set) => ({
  tasks: [],
  accounts: {},
  activeAgent: 'glm',
  
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),
  
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    })),
  
  setAccounts: (agent, accounts) =>
    set((state) => ({
      accounts: { ...state.accounts, [agent]: accounts },
    })),
  
  setActiveAgent: (agent) =>
    set(() => ({
      activeAgent: agent,
    })),
}));

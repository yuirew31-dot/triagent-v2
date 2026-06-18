import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Task } from '../types';
import styles from './ChatBar.module.css';

export function ChatBar() {
  const { tasks, addTask, activeAgent } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: activeAgent, text: input }),
      });

      if (response.ok) {
        const { id } = await response.json();
        const task: Task = {
          id,
          agent: activeAgent as any,
          text: input,
          status: 'active',
          result: null,
          ts: Math.floor(Date.now() / 1000),
        };
        addTask(task);
        setInput('');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.bar}>
      <div className={styles.container}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task..."
          className={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </form>
  );
}

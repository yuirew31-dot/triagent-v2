import React, { useEffect, useState } from 'react';
import styles from './AgentStatus.module.css';

interface AgentStatusType {
  agent: string;
  active: number;
  status: 'ready' | 'busy' | 'cooling';
  lastTaskId: string | null;
}

export function AgentStatus() {
  const [statuses, setStatuses] = useState<AgentStatusType[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();

        const agents = ['glm', 'kimi', 'antigravity', 'groq', 'claude', 'cohere'];
        const newStatuses = agents.map(agent => ({
          agent,
          active: tasks.filter((t: any) => t.agent === agent && t.status === 'active').length,
          status: 'ready' as const,
          lastTaskId: null,
        }));

        setStatuses(newStatuses);
      } catch (error) {
        console.error('Error fetching agent status:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Agent Status</h3>
      <div className={styles.grid}>
        {statuses.map(s => (
          <div key={s.agent} className={`${styles.card} ${styles[s.status]}`}>
            <div className={styles.name}>{s.agent.toUpperCase()}</div>
            <div className={styles.active}>{s.active} active</div>
          </div>
        ))}
      </div>
    </div>
  );
}

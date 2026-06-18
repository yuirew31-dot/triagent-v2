import React from 'react';
import { useStore } from '../store';
import { Task as TaskType } from '../types';
import styles from './TaskFeed.module.css';

export function TaskFeed() {
  const { tasks } = useStore();

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <h2>Task History</h2>
        <span className={styles.count}>{tasks.length} tasks</span>
      </div>

      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <p>No tasks yet. Start by sending a message!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {tasks.map((task) => (
            <div key={task.id} className={`${styles.task} ${styles[task.status]}`}>
              <div className={styles.header_task}>
                <span className={styles.agent}>{task.agent}</span>
                <span className={styles.status}>{task.status}</span>
              </div>
              <p className={styles.text}>{task.text.substring(0, 100)}...</p>
              {task.result && (
                <p className={styles.result}>{task.result.substring(0, 150)}...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

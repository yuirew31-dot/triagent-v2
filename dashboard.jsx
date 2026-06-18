// Dashboard for TriAgent System - Next.js App
// Deploy to Vercel for FREE (https://vercel.com)
// This connects to your TriAgent backend API

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [apiUrl] = useState('http://localhost:3000'); // Change to your production URL

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/metrics`);
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  // Submit new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setPrompt('');
      
      // Refresh data
      await fetchTasks();
      await fetchMetrics();
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMetrics();
    const interval = setInterval(() => {
      fetchTasks();
      fetchMetrics();
    }, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🤖 TriAgent v2 Dashboard</h1>
        <p>Multi-Agent AI System - Real-time Monitoring</p>
      </header>

      <main style={styles.main}>
        {/* Metrics Cards */}
        <div style={styles.metricsGrid}>
          <Card title="Tasks Processed" value={metrics?.totalMetrics || 0} />
          <Card title="Total Cost" value={`$${metrics?.summary?.totalCost?.toFixed(6) || '0'}`} />
          <Card title="Avg Response" value={`${metrics?.summary?.avgExecutionTimeMs?.toFixed(0) || '0'}ms`} />
          <Card title="Cache Hit Rate" value={metrics?.summary?.cacheHitRate || '0%'} />
        </div>

        {/* Input Form */}
        <section style={styles.form}>
          <h2>Create Task</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt... (e.g., 'Create a React component' or 'Design a database schema')"
              style={styles.textarea}
              disabled={loading}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '⏳ Processing...' : '🚀 Submit'}
            </button>
          </form>
        </section>

        {/* Agent Distribution */}
        {metrics?.recentMetrics && (
          <section style={styles.agents}>
            <h2>🤖 Agent Usage</h2>
            <div style={styles.agentList}>
              {Object.entries(
                metrics.recentMetrics.reduce((acc, m) => {
                  acc[m.agent] = (acc[m.agent] || 0) + 1;
                  return acc;
                }, {})
              ).map(([agent, count]) => (
                <div key={agent} style={styles.agentItem}>
                  <span>{agent.toUpperCase()}</span>
                  <span>{count} tasks</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tasks List */}
        <section style={styles.tasks}>
          <h2>📋 Recent Tasks</h2>
          <div style={styles.tasksList}>
            {tasks.slice(-5).reverse().map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>Auto-refreshing every 5 seconds • API: {apiUrl}</p>
      </footer>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

function TaskItem({ task }) {
  return (
    <div style={styles.taskItem}>
      <div style={styles.taskHeader}>
        <strong>{task.agent.toUpperCase()}</strong>
        <span style={styles.taskStatus}>{task.status}</span>
      </div>
      <p style={styles.taskText}>{task.text.substring(0, 100)}...</p>
      <p style={styles.taskMeta}>ID: {task.id.substring(0, 8)}...</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#333',
  },
  header: {
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: '40px',
    textAlign: 'center',
    borderBottom: '2px solid #667eea',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '10px 0 0 0',
  },
  form: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '40px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    marginBottom: '15px',
    boxSizing: 'border-box',
  },
  button: {
    background: '#667eea',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  agents: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '40px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  agentList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  agentItem: {
    background: '#f5f5f5',
    padding: '15px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tasks: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  tasksList: {
    display: 'grid',
    gap: '15px',
  },
  taskItem: {
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '4px',
    borderLeft: '4px solid #667eea',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  taskStatus: {
    background: '#667eea',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  taskText: {
    margin: '10px 0',
    color: '#666',
  },
  taskMeta: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: 'rgba(255,255,255,0.7)',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
};

import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

export default function Index() {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchTasks = async () => {
    try {
      setError('');
      const res = await fetch(`${apiUrl}/api/tasks`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Cannot connect to backend. Check API URL.');
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/metrics`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
      
      const data = await res.json();
      setPrompt('');
      
      // Refresh immediately
      setTimeout(() => {
        fetchTasks();
        fetchMetrics();
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMetrics();

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTasks();
      fetchMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.agent?.toLowerCase().includes(filter.toLowerCase())
  );

  const getAgentColor = (agent) => {
    const colors = {
      'glm': '#667eea',
      'kimi': '#764ba2',
      'gemini': '#f093fb',
      'claude': '#4facfe',
      'groq': '#43e97b',
      'cohere': '#fa709a',
    };
    return colors[agent?.toLowerCase()] || '#667eea';
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>🤖 TriAgent v2 Dashboard</h1>
          <p>Multi-Agent AI System - Real-time Monitoring & Management</p>
          <p className="api-url">API: {apiUrl}</p>
        </div>
        <div className="header-controls">
          <label>
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (5s)
          </label>
          <button onClick={() => { fetchTasks(); fetchMetrics(); }}>
            🔄 Refresh Now
          </button>
        </div>
      </header>

      <main className="main">
        {/* Metrics Cards */}
        {metrics && (
          <section className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <h3>Tasks Processed</h3>
                <p className="metric-value">{metrics.totalMetrics || 0}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>Total Cost</h3>
                <p className="metric-value">${(metrics.summary?.totalCost || 0).toFixed(6)}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <h3>Avg Response Time</h3>
                <p className="metric-value">{Math.round(metrics.summary?.avgExecutionTimeMs || 0)}ms</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <h3>Total Tokens</h3>
                <p className="metric-value">{metrics.summary?.totalTokens || 0}</p>
              </div>
            </div>
          </section>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* Task Creation Form */}
        <section className="form-section">
          <h2>✨ Create New Task</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt...&#10;e.g., 'Create a React component for a payment form' or 'Design a database schema for an e-commerce platform'"
              className="task-input"
              disabled={loading}
              rows="4"
            />
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit" 
                disabled={loading || !prompt.trim()}
              >
                {loading ? '⏳ Processing...' : '🚀 Submit Task'}
              </button>
              <button 
                type="button" 
                className="btn-clear"
                onClick={() => setPrompt('')}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* Agent Distribution */}
        {metrics?.recentMetrics && metrics.recentMetrics.length > 0 && (
          <section className="agents-section">
            <h2>🤖 Agent Usage</h2>
            <div className="agent-grid">
              {Object.entries(
                metrics.recentMetrics.reduce((acc, m) => {
                  const agent = m.agent?.toUpperCase() || 'UNKNOWN';
                  acc[agent] = (acc[agent] || 0) + 1;
                  return acc;
                }, {})
              ).map(([agent, count]) => (
                <div 
                  key={agent} 
                  className="agent-card"
                  style={{ borderLeftColor: getAgentColor(agent) }}
                >
                  <span className="agent-name">{agent}</span>
                  <span className="agent-count">{count} task{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tasks List with Filtering */}
        <section className="tasks-section">
          <div className="tasks-header">
            <h2>📋 Task History</h2>
            <div className="filter-controls">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Agents</option>
                <option value="glm">GLM</option>
                <option value="kimi">Kimi</option>
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
                <option value="groq">Groq</option>
              </select>
              <span className="task-count">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p>📭 No tasks yet</p>
                <p>Create your first task above to get started!</p>
              </div>
            ) : (
              filteredTasks.slice().reverse().map((task) => (
                <div 
                  key={task.id} 
                  className="task-item"
                  style={{ borderLeftColor: getAgentColor(task.agent) }}
                >
                  <div className="task-header">
                    <span className="task-agent">{(task.agent || 'UNKNOWN').toUpperCase()}</span>
                    <span className="task-status">{task.status}</span>
                  </div>
                  <p className="task-text">{task.text.substring(0, 150)}...</p>
                  <div className="task-meta">
                    <span>ID: {task.id?.substring(0, 8)}...</span>
                    <span>Time: {task.createdAt ? new Date(task.createdAt).toLocaleTimeString() : 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>🚀 Powered by TriAgent v2 | Real-time monitoring dashboard | {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import styles from './App.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection - create once and keep alive
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const ws = new WebSocket(`${protocol}//${host}:3000/ws`);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };
    ws.onclose = () => {
      console.log('❌ WebSocket closed');
      setIsConnected(false);
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Filter messages by taskId if we have one
      if (!taskId || data.taskId === taskId) {
        if (data.type === 'chunk') {
          console.log(`📨 Chunk from ${data.taskId}:`, data.content.substring(0, 50));
          setMessages(prev => {
            const updated = [...prev];
            if (updated[updated.length - 1]?.role === 'assistant') {
              updated[updated.length - 1].content += data.content;
            }
            return updated;
          });
        } else if (data.type === 'done') {
          console.log(`✅ Task ${data.taskId} done`);
          setIsLoading(false);
        } else if (data.type === 'error') {
          console.log(`❌ Task ${data.taskId} error:`, data.error);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Error: ${data.error}`, 
            timestamp: Date.now() 
          }]);
          setIsLoading(false);
        }
      }
    };

    wsRef.current = ws;
    // Don't close on component unmount - keep connection alive
    return () => {
      // Optional: close on cleanup only if needed
      // ws.close();
    };
  }, []); // Empty dependency array - create once and keep alive

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Add loading assistant message
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '🔄 Processing...', 
      timestamp: Date.now() 
    }]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input.trim() })
      });

      const data = await response.json();
      setTaskId(data.taskId);

      // Replace loading message
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          role: 'assistant', 
          content: '', 
          timestamp: Date.now() 
        };
        return updated;
      });
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        timestamp: Date.now() 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      {/* Animated background */}
      <div className={styles.background}>
        <div className={styles.stars}></div>
        <div className={styles.nebula}></div>
        <div className={styles.grid}></div>
      </div>

      {/* Main content */}
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚙️</span>
              <h1>TriAgent</h1>
            </div>
            <div className={`${styles.status} ${isConnected ? styles.statusActive : styles.statusInactive}`}>
              <span className={styles.statusDot}></span>
              {isConnected ? 'Connected' : 'Offline'}
            </div>
          </div>
        </header>

        {/* Chat area */}
        <main className={styles.chatArea}>
          <div className={styles.messages}>
            {messages.length === 0 ? (
              <div className={styles.welcome}>
                <div className={styles.welcomeIcon}>🚀</div>
                <h2>TriAgent Orchestrator</h2>
                <p>Multi-Agent AI System with Intelligent Task Distribution</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                  <div className={styles.messageContent}>{msg.content}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input area */}
        <footer className={styles.inputArea}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your task..."
                disabled={isLoading}
                className={styles.input}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className={styles.submitBtn}
              >
                <span className={styles.btnIcon}>→</span>
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default App;

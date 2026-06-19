import React, { useEffect, useState, useRef } from 'react';
import styles from './App.module.css';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ChatMessage, Message as ChatMessageType } from './components/ChatMessage';
import { InputArea } from './components/InputArea';
import { PromptSuggestions, Suggestion } from './components/PromptSuggestions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'pending' | 'sent' | 'error';
  agentName?: string;
}

interface Chat {
  id: string;
  name: string;
  timestamp: number;
  messages: Message[];
}

interface Project {
  id: string;
  name: string;
  icon: string;
}

// Helper to get API URL from environment or runtime detection
const getApiUrl = () => {
  // First try environment variable (build-time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Runtime detection based on current hostname
  const hostname = window.location.hostname;
  if (hostname.includes('triagent-dashboard')) {
    // Running on Render dashboard, use triagent-api service
    return 'https://triagent-api.onrender.com';
  }
  
  // Default for local development
  return 'http://localhost:3000';
};

const getWsUrl = () => {
  const apiUrl = getApiUrl();
  return apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState<string>('');
  const [showExpertMode, setShowExpertMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('gemini');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current chat messages
  const currentChat = chats.find(c => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  // WebSocket connection
  useEffect(() => {
    const wsUrl = getWsUrl();
    const ws = new WebSocket(`${wsUrl}/ws`);

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
      if (!taskId || data.taskId === taskId) {
        if (data.type === 'chunk') {
          console.log(`📨 Chunk from ${data.taskId}:`, data.content.substring(0, 50));
          updateCurrentChatMessage(data.content);
        } else if (data.type === 'done') {
          console.log(`✅ Task ${data.taskId} done`);
          setIsLoading(false);
        } else if (data.type === 'error') {
          console.log(`❌ Task ${data.taskId} error:`, data.error);
          addErrorMessage(`Error: ${data.error}`);
          setIsLoading(false);
        }
      }
    };

    wsRef.current = ws;
    return () => {
      // Keep connection alive
    };
  }, [taskId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('triagent-chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        if (parsedChats.length > 0) {
          setCurrentChatId(parsedChats[0].id);
        }
      } catch (e) {
        console.error('Failed to load chats:', e);
      }
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('triagent-chats', JSON.stringify(chats));
    }
  }, [chats]);

  // Helper functions
  const createNewChat = () => {
    const now = Date.now();
    const newChat: Chat = {
      id: `chat-${now}`,
      name: `Chat ${new Date(now).toLocaleDateString()}`,
      timestamp: now,
      messages: [],
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    if (!currentChatId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: Date.now(),
      status: 'sent',
    };

    setChats(chats.map(chat => {
      if (chat.id === currentChatId) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      }
      return chat;
    }));
  };

  const updateCurrentChatMessage = (content: string) => {
    if (!currentChatId) return;

    setChats(chats.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages];
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'assistant') {
          updatedMessages[updatedMessages.length - 1].content += content;
        }
        return { ...chat, messages: updatedMessages };
      }
      return chat;
    }));
  };

  const addErrorMessage = (errorText: string) => {
    if (!currentChatId) return;

    setChats(chats.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: errorText,
              timestamp: Date.now(),
              status: 'error',
            },
          ],
        };
      }
      return chat;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentChatId) return;

    // Update chat name if it's the first message
    if (messages.length === 0) {
      setChats(chats.map(chat => {
        if (chat.id === currentChatId) {
          return { ...chat, name: input.substring(0, 50) };
        }
        return chat;
      }));
    }

    // Add user message
    addMessage('user', input);

    // Add loading assistant message
    addMessage('assistant', 'AI is thinking...');

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input.trim() }),
      });

      const data = await response.json();
      setTaskId(data.taskId);

      // Replace loading message
      setChats(chats.map(chat => {
        if (chat.id === currentChatId) {
          const updatedMessages = [...chat.messages];
          if (updatedMessages.length > 0) {
            updatedMessages[updatedMessages.length - 1].content = '';
          }
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      }));
    } catch (error) {
      addErrorMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setInput(suggestion.title);
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleLogoClick = () => {
    setShowExpertMode(true);
  };

  return (
    <div className={`${styles.app} theme-${currentTheme}`}>
      {/* Top Bar */}
      <TopBar
        conversationName={currentChat?.name || 'New Conversation'}
        onSearch={() => console.log('Search')}
        onNotifications={() => console.log('Notifications')}
        onSettings={() => console.log('Settings')}
        onProfile={() => console.log('Profile')}
        onLogoClick={handleLogoClick}
      />

      <div className={styles.container}>
        {/* Sidebar */}
        <Sidebar
          chats={chats}
          projects={projects}
          activeChat={currentChatId || ''}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onSelectProject={() => console.log('Select project')}
          onSearch={() => console.log('Search')}
          onSettings={() => console.log('Settings')}
        />

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {/* Chat Messages */}
          {messages.length === 0 ? (
            <PromptSuggestions onSelect={handleSuggestionSelect} />
          ) : (
            <div className={styles.messagesContainer}>
              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={{
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    agentName: msg.agentName,
                  }}
                  isLoading={isLoading && msg.role === 'assistant' && msg === messages[messages.length - 1]}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <InputArea
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onAttachFile={() => console.log('Attach file')}
            onVoiceInput={() => console.log('Voice input')}
            onImageUpload={() => console.log('Image upload')}
          />
        </main>
      </div>

      {/* Expert Mode Modal (hidden by default) */}
      {showExpertMode && (
        <div className={styles.expertModeOverlay}>
          <div className={styles.expertModePanel}>
            <button
              className={styles.closeButton}
              onClick={() => setShowExpertMode(false)}
            >
              ✕
            </button>
            <h2>Expert Mode</h2>
            <p>Internal agent coordination system (for developers only)</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

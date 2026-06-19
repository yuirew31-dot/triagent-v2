import React from 'react';
import styles from './ChatMessage.module.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'pending' | 'sent' | 'error';
  agentName?: string;
  thinking?: string;
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLoading = false,
}) => {
  const isUser = message.role === 'user';

  const renderContent = () => {
    if (isLoading && !isUser) {
      return (
        <div className={styles.loading}>
          <div className={styles.dots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {message.thinking && (
            <div className={styles.thinking}>{message.thinking}</div>
          )}
        </div>
      );
    }

    return <div className={styles.text}>{message.content}</div>;
  };

  return (
    <div
      className={`${styles.message} ${styles[isUser ? 'user' : 'assistant']}`}
      role="article"
    >
      {!isUser && (
        <div className={styles.avatar}>
          <span>🤖</span>
        </div>
      )}

      <div className={styles.bubble}>
        {message.agentName && !isUser && (
          <div className={styles.agentName}>{message.agentName}</div>
        )}
        {renderContent()}

        {message.status === 'error' && !isUser && (
          <div className={styles.error}>Failed to generate response</div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

import React, { useRef, useEffect } from 'react';
import styles from './InputArea.module.css';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  maxLines?: number;
  onAttachFile?: () => void;
  onVoiceInput?: () => void;
  onImageUpload?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  maxLines = 10,
  onAttachFile,
  onVoiceInput,
  onImageUpload,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        maxLines * 24 // Approximate line height
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, maxLines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onSubmit(e as any);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.inputArea}>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          {/* Left Controls */}
          <div className={styles.leftControls}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={onAttachFile}
              title="Attach File"
              disabled={isLoading}
            >
              <span>📎</span>
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={onVoiceInput}
              title="Voice Input"
              disabled={isLoading}
            >
              <span>🎤</span>
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={onImageUpload}
              title="Upload Image"
              disabled={isLoading}
            >
              <span>🖼️</span>
            </button>
          </div>

          {/* Textarea Wrapper */}
          <div className={styles.textareaWrapper}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe your task... (Ctrl+Enter to send)"
              disabled={isLoading}
              className={styles.textarea}
              rows={1}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading || !value.trim()}
            title="Send Message"
            aria-label="Send"
          >
            {isLoading ? (
              <span className={styles.loadingIcon}>⏳</span>
            ) : (
              <span className={styles.sendIcon}>↑</span>
            )}
          </button>
        </div>

        {/* Helper Text */}
        <div className={styles.helperText}>
          Use <kbd>Ctrl+Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
        </div>
      </form>
    </div>
  );
};

export default InputArea;

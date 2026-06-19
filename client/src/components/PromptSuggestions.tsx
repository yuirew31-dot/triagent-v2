import React from 'react';
import styles from './PromptSuggestions.module.css';

export interface Suggestion {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

interface PromptSuggestionsProps {
  suggestions?: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
}

const defaultSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Create an application',
    description: 'Build a new app from scratch',
    icon: '⚡',
  },
  {
    id: '2',
    title: 'Analyze a document',
    description: 'Review and summarize content',
    icon: '📄',
  },
  {
    id: '3',
    title: 'Build a business plan',
    description: 'Create strategic planning',
    icon: '📊',
  },
  {
    id: '4',
    title: 'Research a topic',
    description: 'Gather and synthesize information',
    icon: '🔬',
  },
  {
    id: '5',
    title: 'Generate code',
    description: 'Write and optimize code',
    icon: '💻',
  },
  {
    id: '6',
    title: 'Brainstorm ideas',
    description: 'Creative thinking and ideation',
    icon: '💡',
  },
];

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  suggestions = defaultSuggestions,
  onSelect,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>How can I help you today?</h2>
      </div>

      <div className={styles.grid}>
        {suggestions.map(suggestion => (
          <button
            key={suggestion.id}
            className={styles.suggestionCard}
            onClick={() => onSelect(suggestion)}
            title={suggestion.description}
          >
            {suggestion.icon && (
              <span className={styles.icon}>{suggestion.icon}</span>
            )}
            <div className={styles.content}>
              <h3 className={styles.title}>{suggestion.title}</h3>
              {suggestion.description && (
                <p className={styles.description}>{suggestion.description}</p>
              )}
            </div>
            <span className={styles.arrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;

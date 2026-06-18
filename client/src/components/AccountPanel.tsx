import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import styles from './AccountPanel.module.css';

type AgentTab = 'glm' | 'kimi' | 'antigravity' | 'claude';

export function AccountPanel() {
  const { setActiveAgent } = useStore();
  const [activeTab, setActiveTab] = useState<AgentTab>('glm');
  const [apiKey, setApiKey] = useState('');
  const [label, setLabel] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);

  const handleAddAccount = async () => {
    if (!apiKey.trim() || !label.trim()) return;

    const response = await fetch('/api/account/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: activeTab, apiKey, label }),
    });

    if (response.ok) {
      setApiKey('');
      setLabel('');
      await loadAccounts();
    }
  };

  const loadAccounts = async () => {
    const response = await fetch(`/api/accounts/${activeTab}`);
    if (response.ok) {
      setAccounts(await response.json());
    }
  };

  React.useEffect(() => {
    loadAccounts();
  }, [activeTab]);

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <TabButton
          active={activeTab === 'glm'}
          onClick={() => {
            setActiveTab('glm');
            setActiveAgent('glm');
          }}
          label="GLM"
          icon="◇"
        />
        <TabButton
          active={activeTab === 'kimi'}
          onClick={() => {
            setActiveTab('kimi');
            setActiveAgent('kimi');
          }}
          label="Kimi"
          icon="◆"
        />
        <TabButton
          active={activeTab === 'antigravity'}
          onClick={() => {
            setActiveTab('antigravity');
            setActiveAgent('antigravity');
          }}
          label="Gemini"
          icon="⬡"
        />
        <TabButton
          active={activeTab === 'claude'}
          onClick={() => {
            setActiveTab('claude');
            setActiveAgent('claude');
          }}
          label="Claude"
          icon="◈"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Label (e.g., 'Main', 'Backup')"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={styles.input}
          />
          <Button onClick={handleAddAccount} variant="primary">
            Add Account
          </Button>
        </div>

        <div className={styles.accountList}>
          {accounts.map((acc) => (
            <div key={acc.id} className={`${styles.account} ${styles[acc.status]}`}>
              <span className={styles.label}>{acc.label}</span>
              <span className={styles.status}>{acc.status}</span>
              <span className={styles.usage}>
                {acc.usage_tokens}/{acc.limit_tokens}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        background: active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(51, 65, 85, 0.5)',
        border: active ? '1px solid #3b82f6' : '1px solid rgba(148, 163, 184, 0.2)',
        color: active ? '#3b82f6' : '#94a3b8',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 500,
      }}
    >
      {icon} {label}
    </button>
  );
}

import React, { useState } from 'react';
import styles from './TopBar.module.css';

interface TopBarProps {
  conversationName?: string;
  onSearch?: () => void;
  onNotifications?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
  onLogoClick?: () => void;
  logoClickCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  conversationName = 'New Conversation',
  onSearch,
  onNotifications,
  onSettings,
  onProfile,
  onLogoClick,
  logoClickCount = 0,
}) => {
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    // Reset after 3 seconds
    setTimeout(() => setLogoClicks(0), 3000);

    // Trigger expert mode on 3 clicks
    if (newCount >= 3) {
      onLogoClick?.();
      setLogoClicks(0);
    }
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.content}>
        {/* Left: Logo */}
        <div className={styles.left}>
          <button
            className={styles.logoButton}
            onClick={handleLogoClick}
            title="AI Workspace"
          >
            <span className={styles.logoIcon}>🤖</span>
            <span className={styles.logoText}>AI</span>
          </button>
        </div>

        {/* Center: Conversation Name */}
        <div className={styles.center}>
          <h1 className={styles.conversationName}>{conversationName}</h1>
        </div>

        {/* Right: Actions */}
        <div className={styles.right}>
          <button
            className={styles.actionButton}
            onClick={onSearch}
            title="Search (Ctrl+K)"
            aria-label="Search"
          >
            <span className={styles.icon}>🔍</span>
          </button>

          <button
            className={styles.actionButton}
            onClick={onNotifications}
            title="Notifications"
            aria-label="Notifications"
          >
            <span className={styles.icon}>🔔</span>
            <span className={styles.badge}>0</span>
          </button>

          <button
            className={styles.actionButton}
            onClick={onSettings}
            title="Settings"
            aria-label="Settings"
          >
            <span className={styles.icon}>⚙️</span>
          </button>

          <button
            className={styles.profileButton}
            onClick={onProfile}
            title="Profile"
            aria-label="Profile"
          >
            <div className={styles.avatar}>U</div>
          </button>
        </div>
      </div>

      {/* Hidden: Expert Mode Indicator */}
      {logoClicks > 0 && (
        <div className={styles.expertHint}>
          {logoClicks < 3 && `Click ${3 - logoClicks} more time(s) for Expert Mode`}
        </div>
      )}
    </header>
  );
};

export default TopBar;

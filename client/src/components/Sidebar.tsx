import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface Chat {
  id: string;
  name: string;
  timestamp: number;
}

interface Project {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  chats: Chat[];
  projects: Project[];
  activeChat?: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onSelectProject: (projectId: string) => void;
  onSearch: () => void;
  onSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  projects,
  activeChat,
  onNewChat,
  onSelectChat,
  onSelectProject,
  onSearch,
  onSettings,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= 280 && newWidth <= 340) {
      setSidebarWidth(newWidth);
    }
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const groupChatsByTime = (chatList: Chat[]) => {
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const yesterday = new Date(todayTime);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    const sevenDaysAgo = new Date(todayTime);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTime = sevenDaysAgo.getTime();

    const thirtyDaysAgo = new Date(todayTime);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoTime = thirtyDaysAgo.getTime();

    return {
      today: chatList.filter(c => c.timestamp >= todayTime),
      yesterday: chatList.filter(c => c.timestamp < todayTime && c.timestamp >= yesterdayTime),
      last7Days: chatList.filter(c => c.timestamp < yesterdayTime && c.timestamp >= sevenDaysAgoTime),
      last30Days: chatList.filter(c => c.timestamp < sevenDaysAgoTime && c.timestamp >= thirtyDaysAgoTime),
      archived: chatList.filter(c => c.timestamp < thirtyDaysAgoTime),
    };
  };

  const groupedChats = groupChatsByTime(chats);

  const ChatGroup = ({ title, items }: { title: string; items: Chat[] }) => {
    if (items.length === 0) return null;

    return (
      <div className={styles.chatGroup}>
        <h3 className={styles.groupTitle}>{title}</h3>
        <ul className={styles.chatList}>
          {items.map(chat => (
            <li key={chat.id}>
              <button
                className={`${styles.chatItem} ${activeChat === chat.id ? styles.active : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <span className={styles.chatName}>{chat.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <aside
      className={styles.sidebar}
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* New Chat Button */}
      <button className={styles.newChatBtn} onClick={onNewChat}>
        <span className={styles.icon}>+</span>
        <span>New Chat</span>
      </button>

      {/* Navigation Tabs */}
      <nav className={styles.nav}>
        <button
          className={`${styles.navTab} ${styles.active}`}
          title="Chats"
        >
          💬
        </button>
        <button
          className={styles.navTab}
          onClick={onSelectProject}
          title="Projects"
        >
          📁
        </button>
        <button
          className={styles.navTab}
          title="Skills"
        >
          ✨
        </button>
        <button
          className={styles.navTab}
          onClick={onSearch}
          title="Search"
        >
          🔍
        </button>
        <button
          className={styles.navTab}
          onClick={onSettings}
          title="Settings"
        >
          ⚙️
        </button>
      </nav>

      {/* Chat List */}
      <div className={styles.content}>
        <ChatGroup title="Today" items={groupedChats.today} />
        <ChatGroup title="Yesterday" items={groupedChats.yesterday} />
        <ChatGroup title="Last 7 Days" items={groupedChats.last7Days} />
        <ChatGroup title="Last 30 Days" items={groupedChats.last30Days} />
        <ChatGroup title="Archived" items={groupedChats.archived} />

        {chats.length === 0 && (
          <div className={styles.emptyState}>
            <p>No chats yet</p>
            <p className={styles.emptyHint}>Start a new conversation</p>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className={styles.projectsSection}>
            <h3 className={styles.groupTitle}>Projects</h3>
            <ul className={styles.projectsList}>
              {projects.map(project => (
                <li key={project.id}>
                  <button
                    className={styles.projectItem}
                    onClick={() => onSelectProject(project.id)}
                  >
                    <span className={styles.projectIcon}>{project.icon}</span>
                    <span className={styles.projectName}>{project.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className={styles.resizeHandle}
        onMouseDown={handleMouseDown}
      />
    </aside>
  );
};

export default Sidebar;

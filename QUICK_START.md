# 📚 TriAgent v2 — Полное руководство по проекту

**Дата обновления:** 18 июня 2026  
**Количество файлов:** 40  
**Архитектура:** Node.js + Fastify + SQLite + React + Vite + WebSocket

---

## 📂 Как открыть проект в VS Code

### 1️⃣ Открыть папку проекта

```bash
cd d:\Lev\PythonProjects\triagent-v2
code .
```

### 2️⃣ Структура папок (как видно в файловом менеджере VS Code)

```
triagent-v2/
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── Procfile
├── README.md
├── capacitor.config.ts
├── ecosystem.config.js
├── package.json
├── railway.json
├── railway.toml
├── tsconfig.json
│
├── server/                    ← Бэкенд (Node.js + Fastify)
│   ├── .env.example
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts           ← ГЛАВНЫЙ ФАЙЛ: Fastify сервер
│   │   ├── db.ts              ← SQLite + шифрование ключей
│   │   ├── ws.ts              ← WebSocket управление
│   │   ├── accountPool.ts     ← Ротация аккаунтов
│   │   ├── rateLimiter.ts     ← Rate limiting
│   │   ├── orchestrator.ts    ← Маршрутизация задач
│   │   ├── context/
│   │   │   └── contextManager.ts  ← (Будущее)
│   │   └── agents/
│   │       ├── glm.ts         ← Fireworks GLM 5.2 + SiliconFlow fallback
│   │       ├── kimi.ts        ← Fireworks Kimi K2.7 + DeepSeek fallback
│   │       ├── antigravity.ts ← Gemini 3.5 Flash (обновлено)
│   │       ├── cohere-rag.ts  ← Cohere RAG (новое)
│   │       ├── groq.ts        ← Groq relay + compression
│   │       ├── claude.ts      ← Claude Sonnet
│   │       └── siliconflow.ts ← (Опционально)
│   └── public/                ← Собранный React app (после npm run build)
│
├── client/                    ← Фронтенд (React + Vite)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx           ← React entry point
│       ├── App.tsx            ← Главный компонент
│       ├── store.ts           ← Zustand state management
│       ├── types.ts           ← TypeScript типы
│       ├── App.module.css     ← Стили App
│       ├── components/
│       │   ├── ChatBar.tsx        ← Input bar для задач
│       │   ├── ChatBar.module.css
│       │   ├── TaskFeed.tsx       ← История задач
│       │   ├── TaskFeed.module.css
│       │   ├── AccountPanel.tsx   ← Управление ключами API
│       │   ├── AccountPanel.module.css
│       │   ├── AgentStatus.tsx    ← Статус агентов
│       │   ├── AgentStatus.module.css
│       │   ├── PipelineView.tsx   ← Pipeline визуализация
│       │   ├── PipelineView.module.css
│       │   └── ui/
│       │       ├── Button.tsx
│       │       └── Button.module.css
│       └── styles/
│           └── global.css     ← Глобальные стили (scrollbar и т.д)
│
├── tauri/                     ← Desktop app (Tauri)
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   └── src/                   ← (Rust код)
│
└── (другие конфиги на корневом уровне)
```

---

## 🚀 Быстрый старт (10 минут)

### Шаг 1: Откройте терминал в VS Code

```
Ctrl + ` (backtick)
```

### Шаг 2: Установите зависимости

```bash
npm install
```

### Шаг 3: Настройте переменные окружения

```bash
# Скопируйте .env.example в .env
cp server/.env.example server/.env

# Откройте server/.env и добавьте API ключи:
# - FIREWORKS_API_KEY
# - SILICONFLOW_API_KEY
# - GEMINI_API_KEY_1
# - COHERE_API_KEY
```

### Шаг 4: Запустите проект

```bash
npm run dev
```

Откроются:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

---

## 📖 Что находится где? (Чек-лист)

### Если нужен фронтенд (React компонент)
👉 Идите в: `client/src/components/`

**Файлы для редактирования:**
- [ChatBar.tsx](client/src/components/ChatBar.tsx) — Ввод задач
- [TaskFeed.tsx](client/src/components/TaskFeed.tsx) — История задач  
- [AccountPanel.tsx](client/src/components/AccountPanel.tsx) — Управление ключами
- [AgentStatus.tsx](client/src/components/AgentStatus.tsx) — Статус агентов

**Стили (CSS Modules):**
- `ChatBar.module.css`, `TaskFeed.module.css` и т.д.

### Если нужен бэкенд (логика агентов)
👉 Идите в: `server/src/`

**Главный файл:**
- [index.ts](server/src/index.ts) — Fastify сервер, API endpoints

**Агенты AI:**
- [glm.ts](server/src/agents/glm.ts) — GLM 5.2 (frontend)
- [kimi.ts](server/src/agents/kimi.ts) — Kimi K2.7 (backend)
- [antigravity.ts](server/src/agents/antigravity.ts) — Gemini 3.5 Flash (math)
- [cohere-rag.ts](server/src/agents/cohere-rag.ts) — RAG поиск

**Система:**
- [db.ts](server/src/db.ts) — SQLite база + шифрование
- [orchestrator.ts](server/src/orchestrator.ts) — Маршрутизация задач
- [accountPool.ts](server/src/accountPool.ts) — Управление ключами

### Если нужно добавить ключ API
👉 Идите в: `server/.env`

```env
FIREWORKS_API_KEY="your-key"
SILICONFLOW_API_KEY="your-key"
GEMINI_API_KEY_1="your-key"
COHERE_API_KEY="your-key"
```

### Если нужно развернуть
👉 Идите в: Папка корня

**Готовые конфиги:**
- [railway.toml](railway.toml) — Railway.app
- [Procfile](Procfile) — Heroku
- [Dockerfile](Dockerfile) — Docker
- [docker-compose.yml](docker-compose.yml) — Docker Compose
- [ecosystem.config.js](ecosystem.config.js) — PM2

---

## 🔑 API Ключи: Как получить

### 1. Fireworks AI ($6.00 баланс) — GLM + Kimi
```
https://fireworks.ai
→ Sign up
→ API Keys → Copy
→ Добавить в FIREWORKS_API_KEY
```

### 2. SiliconFlow ($1.00 + бесплатные модели) — Fallback
```
https://siliconflow.cn
→ Register
→ API Token → Copy
→ Добавить в SILICONFLOW_API_KEY
```

### 3. Google Gemini (FREE 50 req/min) — Math #1
```
https://aistudio.google.com
→ Create API Key
→ Добавить в GEMINI_API_KEY_1
```

### 4. Cohere (Trial FREE) — RAG поиск
```
https://cohere.com/dashboard
→ API Keys → Copy
→ Добавить в COHERE_API_KEY
```

---

## 💻 VS Code Команды

### Разработка

```bash
# Запустить dev server (оба сервера одновременно)
npm run dev

# Только backend
npm run server:dev

# Только frontend
npm run client:dev
```

### Сборка

```bash
# Собрать всё
npm run server:build && npm run client:build

# Собрать backend
npm run server:build

# Собрать frontend
npm run client:build
```

### Запуск продакшена

```bash
npm run server:start
```

### Качество кода

```bash
npm run lint      # Проверить ошибки
npm run format    # Отформатировать код
```

---

## 🧪 Тестирование

### Тест API endpoint (используйте curl в VS Code терминале)

```bash
# Health check
curl http://localhost:3000/health

# Создать задачу
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"agent":"glm","text":"Hello world"}'

# Получить все задачи
curl http://localhost:3000/api/tasks

# Получить аккаунты
curl http://localhost:3000/api/accounts/glm
```

### WebSocket тест (если установлен wscat)

```bash
wscat -c ws://localhost:3000/ws
# Затем отправляйте JSON сообщения
```

### Браузер тест

```
1. Откройте http://localhost:5173
2. Перейдите на вкладку "AccountPanel"
3. Добавьте API ключ
4. Напишите задачу в ChatBar
5. Смотрите результаты в TaskFeed
```

---

## 📊 База данных (SQLite)

### Просмотр данных

```bash
sqlite3 triagent.db

# Коман-ды:
sqlite> SELECT * FROM tasks;
sqlite> SELECT * FROM accounts;
sqlite> SELECT * FROM agent_state;
```

### Структура таблиц

```sql
-- Задачи
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  agent TEXT,
  text TEXT,
  status TEXT,          -- active, done, error, rotated
  result TEXT,
  ts INTEGER
);

-- Аккаунты (с шифрованием)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  agent TEXT,
  label TEXT,
  key_encrypted TEXT,   -- AES-256-GCM
  status TEXT,          -- ready, active, cooling, exhausted
  usage_tokens INTEGER,
  limit_tokens INTEGER,
  rotations INTEGER,
  last_reset INTEGER
);

-- Состояние агентов
CREATE TABLE agent_state (
  agent TEXT PRIMARY KEY,
  active INTEGER,
  last_task_id TEXT
);
```

---

## 🔒 Безопасность

✅ **API ключи зашифрованы** в БД (AES-256-GCM)  
✅ **Никогда не отправляем** ключи в браузер  
✅ **Environment variables** для конфиденциальных данных  
✅ **SQLite WAL mode** для конкурентного доступа  

---

## 🐛 Debugging

### Включить логи

В `server/src/index.ts`:
```typescript
const fastify = Fastify({ logger: true });  // logger: true
```

### DevTools браузера

```
F12 → Console → Смотреть ошибки
F12 → Network → Смотреть API запросы
F12 → Application → Local Storage
```

### VS Code Debugger

Добавьте в `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Server",
      "program": "${workspaceFolder}/server/dist/index.js",
      "preLaunchTask": "npm: server:build"
    }
  ]
}
```

---

## 📈 Иерархия файлов по важности

### 🔴 КРИТИЧНО (Не трогать без плана)
1. [package.json](package.json) — зависимости
2. [server/src/index.ts](server/src/index.ts) — сервер
3. [server/src/db.ts](server/src/db.ts) — база данных
4. [server/src/orchestrator.ts](server/src/orchestrator.ts) — маршрутизация

### 🟡 ВАЖНО (Для изменений логики)
1. [server/src/agents/glm.ts](server/src/agents/glm.ts)
2. [server/src/agents/kimi.ts](server/src/agents/kimi.ts)
3. [client/src/App.tsx](client/src/App.tsx)
4. [client/src/components/ChatBar.tsx](client/src/components/ChatBar.tsx)

### 🟢 ОПЦИОНАЛЬНО (Можно расширять)
1. [server/src/agents/cohere-rag.ts](server/src/agents/cohere-rag.ts)
2. [client/src/components/AgentStatus.tsx](client/src/components/AgentStatus.tsx)
3. [client/src/components/PipelineView.tsx](client/src/components/PipelineView.tsx)

---

## 🎯 Часто выполняемые задачи

### Добавить новый агент (например, OpenAI)

1. **Создайте файл:**
   ```bash
   touch server/src/agents/openai.ts
   ```

2. **Скопируйте шаблон из** [glm.ts](server/src/agents/glm.ts)

3. **Обновите:** [orchestrator.ts](server/src/orchestrator.ts)
   ```typescript
   case 'openai':
     await runOpenAI(id, text);
     break;
   ```

4. **Добавьте в** [db.ts](server/src/db.ts):
   ```typescript
   export type AgentId = 'glm' | 'kimi' | ... | 'openai';
   ```

### Изменить стили компонента

1. Откройте `client/src/components/ChatBar.module.css`
2. Измените CSS
3. Горячая перезагрузка работает автоматически

### Добавить новый REST endpoint

1. Откройте [server/src/index.ts](server/src/index.ts)
2. Добавьте:
   ```typescript
   fastify.get('/api/new-endpoint', async (request, reply) => {
     return { data: 'hello' };
   });
   ```

### Развернуть на Railway

1. `git push origin main`
2. Railway автоматически развернёт (смотрит на `railway.toml`)

---

## ✅ Чек-лист перед запуском

- [ ] Установлены зависимости: `npm install`
- [ ] Скопирован `.env.example` в `.env`
- [ ] Добавлены API ключи в `server/.env`
- [ ] Нет ошибок в консоли: `npm run lint`
- [ ] Запускается без ошибок: `npm run dev`
- [ ] Доступен http://localhost:3000/health
- [ ] Доступен http://localhost:5173

---

## 📚 Дополнительные ресурсы

- **Fastify документация:** https://www.fastify.io/
- **React документация:** https://react.dev/
- **Vite документация:** https://vitejs.dev/
- **SQLite документация:** https://www.sqlite.org/
- **Arena Leaderboard:** https://arena.ai/leaderboard

---

**Created:** June 18, 2026  
**Last Updated:** June 18, 2026  
**Status:** Production Ready ✅

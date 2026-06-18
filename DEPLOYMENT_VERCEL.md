# 🚀 Развертывание TriAgent Dashboard на Vercel (БЕСПЛАТНО)

## ✨ Что получишь:
- ✅ Бесплатное хостирование (Vercel free tier)
- ✅ Постоянный URL для доступа
- ✅ Auto-refresh метрик каждые 5 секунд
- ✅ Поддержка SSL/HTTPS
- ✅ CDN по всему миру (для быстрости)
- ✅ Автоматические деплои при пушах
- ✅ Встроенные environment variables

## 📋 Шаги развертывания:

### Шаг 1: Подготовить репозиторий GitHub
```bash
# 1.1. Инициализировать git репозиторий (если не инициализирован)
cd d:\Lev\PythonProjects\triagent-v2
git init
git add .
git commit -m "Initial commit - TriAgent v2 with Dashboard"

# 1.2. Создать репозиторий на GitHub:
# - Перейти на https://github.com/new
# - Название: triagent-v2-dashboard
# - Description: "Multi-Agent AI System Dashboard"
# - Выбрать Public (чтобы Vercel мог видеть)
# - Нажать Create repository

# 1.3. Подключить удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/triagent-v2-dashboard.git
git branch -M main
git push -u origin main
```

### Шаг 2: Создать Next.js приложение
```bash
# 2.1. Установить зависимости
npm install next react react-dom

# 2.2. Создать структуру проекта для Vercel
mkdir -p pages/api
mkdir -p public

# 2.3. Скопировать dashboard.jsx в pages/
cp dashboard.jsx pages/dashboard.jsx
```

### Шаг 3: Создать package.json для Vercel
```json
{
  "name": "triagent-v2-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### Шаг 4: Развернуть на Vercel
**Вариант A: Через веб-интерфейс (самый простой)**
1. Перейти на https://vercel.com
2. Нажать "Sign up" → выбрать "Sign up with GitHub"
3. Авторизоваться на GitHub
4. Нажать "New Project"
5. Выбрать свой репозиторий "triagent-v2-dashboard"
6. Нажать "Import"
7. Нажать "Deploy"

**Вариант B: Через CLI (более продвинутый)**
```bash
# Установить Vercel CLI
npm install -g vercel

# Войти в Vercel
vercel login

# Развернуть проект
vercel
# Следовать инструкциям в командной строке
```

### Шаг 5: Настроить Environment Variables
После развертывания на Vercel:
1. Перейти на https://vercel.com/dashboard
2. Выбрать проект "triagent-v2-dashboard"
3. Нажать "Settings"
4. Нажать "Environment Variables"
5. Добавить переменную:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-triagent-backend.com` (URL твоего backend)
   - **Environments**: Production, Preview, Development

### Шаг 6: Обновить API URL в dashboard.jsx
```javascript
// Измени эту строку:
const [apiUrl] = useState('http://localhost:3000');

// На эту:
const [apiUrl] = useState(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
);
```

## 🌐 Варианты для Backend (BACKEND ТОЖЕ МОЖНО БЕСПЛАТНО):

### Option 1: Развернуть Backend на Railway (РЕКОМЕНДУЕТСЯ)
```bash
# 1. Перейти на https://railway.app
# 2. Нажать "New Project"
# 3. Выбрать "Deploy from GitHub"
# 4. Авторизоваться
# 5. Выбрать "triagent-v2" репозиторий
# 6. Railway автоматически прочитает railway.toml и развернет
# 7. Получишь публичный URL
```

**Railway free tier:**
- ✅ $5/месяц бесплатных кредитов (достаточно для small projects)
- ✅ Автоматические деплои
- ✅ PostgreSQL + Redis бесплатно

### Option 2: Развернуть Backend на Render.com
```bash
# 1. Перейти на https://render.com
# 2. Нажать "New +"
# 3. Выбрать "Web Service"
# 4. Подключить GitHub
# 5. Выбрать "triagent-v2"
# 6. Build command: npm run build
# 7. Start command: npm run start
```

**Render free tier:**
- ⚠️ Сервер спит после 15 минут неактивности (просыпается при первом запросе)
- ✅ Подходит для development/testing

### Option 3: Локальный Backend + ngrok для публичного доступа
```bash
# 1. Твой backend уже запущен на localhost:3000
# 2. Установить ngrok: https://ngrok.com
# 3. Запустить ngrok:
ngrok http 3000

# 4. Получишь публичный URL типа: https://abc123.ngrok.io
# 5. Использовать этот URL в Vercel Environment Variables
```

**ngrok free tier:**
- ✅ Публичный URL для локального сервера
- ⚠️ URL меняется при перезагрузке (используй paid план для static URL)

## 🔒 Security (Безопасность)

### API Keys в Backend
```javascript
// server/.env (никогда не коммитить!)
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk-...
SILICONFLOW_API_KEY=sk-...
GEMINI_API_KEY=AIza...
```

### CORS настройка для Vercel
```typescript
// server/index.ts
app.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://triagent-dashboard.vercel.app', // Твой Vercel URL
  ],
  credentials: true,
});
```

## 📊 Мониторинг метрик

### Интеграция с Grafana (бесплатно)
```bash
# Добавить endpoint для метрик
GET /api/metrics

# Ответ включает:
{
  "totalMetrics": 25,
  "summary": {
    "totalCost": 0.00015,
    "totalTokens": 1200,
    "avgExecutionTimeMs": 450,
    "cacheHitRate": "35%"
  }
}
```

### Логирование в Sentry (бесплатно)
```javascript
import * as Sentry from "@sentry/nextjs";

export function reportException(error) {
  Sentry.captureException(error);
}
```

## 🚨 Troubleshooting

### "CORS error при запросе к backend"
- Убедиться что backend в CORS разрешил твой Vercel URL
- Проверить что backend запущен и доступен

### "Dashboard не обновляет метрики"
- Проверить что API_URL правильный
- Открыть DevTools (F12) → Network и посмотреть запросы
- Проверить что backend возвращает JSON

### "Vercel говорит что нельзя найти страницу"
- Убедиться что pages/dashboard.jsx существует
- Пересчитать build: `npm run build`
- Переделать deploy на Vercel

## 🎉 Готово! Теперь у тебя есть:

✅ **Dashboard URL**: https://triagent-dashboard.vercel.app
✅ **Real-time metrics**: Обновляются каждые 5 секунд
✅ **Task creation**: Создавать задачи прямо с сайта
✅ **Agent monitoring**: Видеть какой агент что делает
✅ **Cost tracking**: Отслеживать расходы на API
✅ **Permanent access**: 24/7 доступ через браузер
✅ **FREE**: Абсолютно бесплатно (кроме самого backend)

## 📚 Дополнительные ресурсы:

- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Railway docs: https://docs.railway.app
- ngrok docs: https://ngrok.com/docs

## 💡 Оптимизация costs:

1. **Используй Gemini (FREE)** для math tasks
2. **Используй Groq (FREE)** для compression
3. **Кэширование** - одинаковые запросы не платишь повторно
4. **Batch processing** - обрабатывать задачи группами
5. **Fallback chains** - если основной агент дорогой, используй дешевый

---

**Нужна помощь?** Я могу помочь с:
- Развертыванием на Railway/Render
- Настройкой CORS
- Доп функциями в Dashboard
- Мониторингом метрик

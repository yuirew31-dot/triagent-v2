# 🚀 TriAgent v2 — Production Guide

**Дата: 18 июня 2026**  
**Статус: ✅ Production Ready**  
**Version: 2.0.0**

---

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Smart Orchestrator](#smart-orchestrator)
3. [Context Compression](#context-compression)
4. [Агенты и их специальности](#агенты-и-их-специальности)
5. [Развертывание](#развертывание)
6. [API Reference](#api-reference)
7. [Мониторинг и затраты](#мониторинг-и-затраты)
8. [Troubleshooting](#troubleshooting)

---

## 📊 Обзор архитектуры

### Система состоит из 3 уровней:

```
┌─────────────────────────────────────────┐
│  USER REQUEST (через REST API)          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  SMART ORCHESTRATOR (Claude)            │
│  • Анализ задачи (O(1))                 │
│  • Выбор оптимального агента            │
│  • Кеширование (30 мин TTL)             │
│  • Мониторинг затрат                    │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
   PRIMARY AGENTS    FALLBACK AGENTS
   • GLM 5.2         • Qwen 72B
   • Kimi K2.7       • DeepSeek V3
   • Gemini 3.5 Flash• LLaMA 3.1
   • Claude 3.5      (через Groq)
        │                 │
        └────────┬────────┘
                 ▼
   ┌──────────────────────────┐
   │  GROQ (Context Compress) │
   │  100K tokens → 500 tokens│
   │  (99% экономия!)         │
   └──────────────────────────┘
                 │
                 ▼
   ┌──────────────────────────┐
   │  RESPONSE (WebSocket)    │
   │  • Streaming chunks      │
   │  • Real-time updates     │
   └──────────────────────────┘
```

---

## 🧠 Smart Orchestrator

### Как это работает?

**Smart Orchestrator** - это центральный агент (Claude 3.5 Sonnet), который:

1. **Анализирует задачу** - определяет тип (frontend/backend/math/research/creative)
2. **Выбирает агента** - направляет запрос к специалисту
3. **Сжимает контекст** - если > 4000 токенов, использует Groq
4. **Кеширует результаты** - для идентичных запросов (O(1))
5. **Логирует метрики** - для мониторинга затрат

### Маршрутизация:

```typescript
Task Type      → Primary Agent    → Reason
─────────────────────────────────────────────────────────
frontend       → GLM 5.2          #9 WebDev на Arena
backend        → Kimi K2.7        #7 Image-to-Web (лучший)
math           → Gemini 3.5       #1 Math (абсолют. чемпион)
research       → Kimi K2.7        Для анализа
creative       → Claude 3.5       Для творчества
mixed/unknown  → Claude 3.5       Универсальный выбор
```

### Примеры анализа:

```bash
# Request 1: "Create React button component"
→ Type: frontend
→ Agent: GLM (специалист по фронтенду)
→ Tokens: ~1500
→ Compression: No (< 4000 tokens)

# Request 2: "Design microservices with Kubernetes"
→ Type: backend
→ Agent: Kimi (специалист по архитектуре)
→ Tokens: ~2500
→ Compression: No

# Request 3: "Solve differential equation + 50KB context"
→ Type: math
→ Agent: Gemini (чемпион по математике)
→ Tokens: ~50000
→ Compression: YES! (через Groq: 50K → 1K)
```

---

## 📦 Context Compression

### Проблема:

- Claude/Kimi дорогие (~$0.003 за 1K токенов)
- Большие контексты = большие затраты
- Пример: 100K токенов на Claude = $0.30

### Решение: Groq Compression

```
Input:  "Lorem ipsum dolor sit amet... [100K tokens]"
                     ↓
            Groq LLaMA 3.1
          (200K tokens/sec!)
                     ↓
Output: "Key points: [1-2K tokens]"

Экономия: 100K → 2K (98%! 💰)
Стоимость: $0.30 → $0.0006 (500x дешевле!)
```

### Как это работает?

**Автоматически:**
```typescript
if (analysis.estimatedTokens > 4000) {
  finalPrompt = await compressContextViaGroq(userPrompt);
}
```

**Вручную:**
```bash
curl -X POST http://localhost:3000/api/compress \
  -H "Content-Type: application/json" \
  -d '{"context": "Large context here..."}'
```

---

## 👥 Агенты и их специальности

### 1. GLM 5.2 (Fireworks) ⭐

```
Arena Rank: #9 WebDev
Specialty: Frontend, UI, React, Vue, CSS
Cost: $0.00015 per 1K tokens
Speed: 100K tokens/min
Fallback: Qwen 72B (SiliconFlow)

Best for:
✅ React/Vue components
✅ Tailwind CSS
✅ HTML/CSS/JavaScript
✅ Web design
❌ Not ideal for: Backend architecture, math
```

### 2. Kimi K2.7 (Fireworks) ⭐

```
Arena Rank: #7 Image-to-Web
Specialty: Backend, Architecture, Vision
Cost: $0.0002 per 1K tokens
Speed: 100K tokens/min
Fallback: DeepSeek V3 (SiliconFlow)

Best for:
✅ Microservices architecture
✅ API design
✅ Database schemas
✅ System design
✅ Image-to-code conversion
❌ Not ideal for: Math, creative writing
```

### 3. Gemini 3.5 Flash (Google) ⭐

```
Arena Rank: #1 Math (!!)
Specialty: Mathematics, Analytics, Physics
Cost: FREE (50 req/min)
Speed: 50K tokens/min

Best for:
✅ Mathematical problems
✅ Statistical analysis
✅ Physical calculations
✅ Algorithm analysis
✅ Complex reasoning
❌ Not ideal for: Long-form writing
```

### 4. Claude 3.5 Sonnet (Anthropic)

```
Arena Rank: #10 Text
Specialty: Complex reasoning, QA
Cost: $0.003 per 1K tokens (дорого!)
Speed: 40K tokens/min
Role: CENTRAL ORCHESTRATOR

Best for:
✅ Task analysis (orchestrator)
✅ Creative writing
✅ Complex reasoning
✅ Fallback for unknown tasks
⚠️ Expensive - используется экономно!
```

### 5. Groq LLaMA 3.1 (Groq)

```
Arena Rank: Not ranked (speed machine!)
Specialty: Context compression, fast relay
Cost: FREE
Speed: 200K tokens/min (САМЫЙ БЫСТРЫЙ!)
Role: Context compressor

Best for:
✅ Reducing large contexts
✅ Fast summarization
✅ Relay operations
✅ Batch processing
```

### 6. Qwen 72B (SiliconFlow) 🆓

```
Cost: $0.000001 per 1K tokens
Speed: 999K tokens/min (практически бесплатно!)
Role: PRIMARY FALLBACK

Best for:
✅ Fallback for GLM
✅ General purpose
✅ Cost optimization
```

### 7. DeepSeek V3 (SiliconFlow) 🆓

```
Cost: $0.000001 per 1K tokens
Speed: 999K tokens/min
Role: FALLBACK FOR KIMI

Best for:
✅ Fallback for Kimi
✅ Complex reasoning
✅ Cost optimization
```

---

## 🚀 Развертывание

### Локальная разработка

```bash
# 1. Клонировать и установить зависимости
git clone <repo>
cd triagent-v2
npm install

# 2. Установить .env
cp server/.env.example server/.env
# Заполнить все API ключи

# 3. Запустить разработку
npm run dev
# Server: http://localhost:3000
# Client: http://localhost:5173
```

### Production (Railway / Heroku / Docker)

```bash
# 1. Build
npm run server:build
npm run client:build

# 2. Deploy to Railway
railway up

# 3. Или Docker
docker build -t triagent-v2 .
docker run -p 3000:3000 -e PORT=3000 triagent-v2
```

### Environment Variables

```env
# Required API Keys
ANTHROPIC_API_KEY=sk-ant-...              # Claude (для анализа)
FIREWORKS_API_KEY=fw_...                  # GLM + Kimi
SILICONFLOW_API_KEY=sk-...                # Qwen + DeepSeek
GEMINI_API_KEY_1=AIzaSy_...               # Gemini
GROQ_API_KEY=gsk_...                      # Context compression
COHERE_API_KEY=xxx                        # RAG (опционально)

# Optional
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=production
```

---

## 📡 API Reference

### 1. Create Task (Smart Orchestration)

```bash
POST /api/tasks
Content-Type: application/json

{
  "prompt": "Create a React component for login form"
}

Response:
{
  "taskId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Что происходит:**
1. Задача создается в БД
2. Smart Orchestrator анализирует запрос
3. Выбирается оптимальный агент (GLM для frontend)
4. Результаты стримят через WebSocket
5. Финальный результат сохраняется в БД

### 2. Get All Tasks

```bash
GET /api/tasks

Response:
[
  {
    "id": "550e...",
    "agent": "glm",
    "text": "Create a React component...",
    "status": "done",
    "result": "import React from 'react'...",
    "ts": 1718700000
  },
  ...
]
```

### 3. Get Tasks by Agent

```bash
GET /api/tasks/glm
GET /api/tasks/kimi
GET /api/tasks/gemini
```

### 4. Get Usage Metrics

```bash
GET /api/metrics

Response:
{
  "totalMetrics": 145,
  "cacheSize": 23,
  "recentMetrics": [
    {
      "agent": "glm",
      "tokensUsed": 1234,
      "estimatedCost": 0.00018,
      "executionTimeMs": 2345,
      "cached": false
    },
    ...
  ],
  "summary": {
    "avgExecutionTimeMs": 2100,
    "totalTokens": 234567,
    "totalCost": 0.45,
    "cacheHitRate": "35.2%"
  }
}
```

### 5. Compress Context (Manual)

```bash
POST /api/compress
Content-Type: application/json

{
  "context": "Large context to compress..."
}

Response:
{
  "original": { "length": 15420 },
  "compressed": { "length": 512 },
  "compressionRatio": "3.32%",
  "result": "Summary: ..."
}
```

### 6. Add Account

```bash
POST /api/account/add
{
  "agent": "glm",
  "apiKey": "fw_xxx",
  "label": "GLM Production Key"
}
```

### 7. Get Accounts

```bash
GET /api/accounts
GET /api/accounts/glm
```

### 8. Health Check

```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": 1718700000
}
```

---

## 💰 Мониторинг и затраты

### Cost Breakdown (за 1000 токенов)

```
Agent              Cost/1K Tokens    When to use
─────────────────────────────────────────────────
✅ Gemini          $0.00 (FREE!)     Math tasks
✅ Groq            $0.00 (FREE!)     Context compression
🆓 Qwen 72B        $0.000001         Fallback for GLM
🆓 DeepSeek V3     $0.000001         Fallback for Kimi
💵 GLM 5.2         $0.00015          Frontend
💵 Kimi K2.7       $0.0002           Backend
💰 Claude 3.5      $0.003            Analysis only (smart router)
```

### Примеры затрат:

```bash
# Frontend task (1500 tokens)
GLM: 1500 * $0.00015 / 1000 = $0.000225

# Backend task (2500 tokens) + Compression
Kimi: 2500 * $0.0002 / 1000 = $0.0005

# Large math task (50K tokens) with Groq compression
Gemini (original): FREE
Groq (compression): FREE
Total: $0.00 ✅

# Unknown task (uses Claude analysis)
Claude: 300 * $0.003 / 1000 = $0.0009
Agent execution: depends on selected
Total: ~$0.001-0.005
```

### Мониторинг в реальном времени:

```bash
# Получить метрики
curl http://localhost:3000/api/metrics | jq

# Ожидаемый вывод:
{
  "totalMetrics": 234,
  "summary": {
    "avgExecutionTimeMs": 2100,
    "totalTokens": 450000,
    "totalCost": 0.75,           # ← Всего потрачено за сессию
    "cacheHitRate": "42.3%"      # ← Экономия от кеша!
  }
}
```

### Dashboard (для мониторинга):

```
┌─ Usage Metrics ─────────────────────┐
│ Total Cost: $0.75                   │
│ Total Tokens: 450K                  │
│ Avg Execution Time: 2.1s            │
│ Cache Hit Rate: 42.3%               │
│                                     │
│ Top Agents:                         │
│ 🏆 GLM: 120 tasks ($0.018)         │
│ 🏆 Kimi: 80 tasks ($0.016)         │
│ 🏆 Gemini: 50 tasks ($0.00)        │
│ 🏆 Claude: 34 tasks ($0.1)         │
└─────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### 1. "Groq API key not configured"

```bash
Error: Groq compression disabled

Fix:
export GROQ_API_KEY="gsk_..."
npm run dev
```

### 2. "Claude analysis failed, using heuristic"

```
Возможные причины:
1. ANTHROPIC_API_KEY не установлен
2. Claude API quota превышен
3. Network error

Fix:
- Проверить ANTHROPIC_API_KEY в .env
- Использовать другой API ключ
- Проверить интернет соединение
- Хeuristic анализ всё равно работает, просто менее точный
```

### 3. "GLM failed, trying fallback (Qwen)..."

```
Возможные причины:
1. Fireworks API ошибка
2. API rate limit
3. Model unavailable

Fix:
- Проверить FIREWORKS_API_KEY
- Дождаться recovery (автоматический fallback)
- Проверить Fireworks dashboard
```

### 4. High latency (>10s)

```
Возможные причины:
1. Large context (> 50K tokens)
2. Groq compression slow
3. Network latency

Fix:
- Сократить контекст
- Использовать кеш (повторные запросы)
- Проверить интернет
- Выбрать более быстрый агент (Gemini вместо Claude)
```

### 5. Out of Memory

```
Возможные причины:
1. Cache size превышен (1000 items)
2. Memory leak в агентах
3. Large response buffer

Fix:
- Cache автоматически управляется (FIFO)
- Перезагрузить сервер
- Проверить node memory: node --max-old-space-size=4096
```

---

## ✅ Checklist перед публикацией

- [ ] Все API ключи установлены и валидны
- [ ] Тесты проходят: `npm test`
- [ ] Нет ошибок: `npm run lint`
- [ ] Build успешен: `npm run server:build && npm run client:build`
- [ ] WebSocket работает (тестировать в браузере)
- [ ] Metrics endpoint работает: `curl localhost:3000/api/metrics`
- [ ] Cache работает (повторные запросы быстрее)
- [ ] Fallbacks работают (отключить primary agent API key и проверить)
- [ ] Database инициализирована: `npm run db:init`
- [ ] CORS правильно настроен
- [ ] Логирование работает (check console.logs)
- [ ] Production environment переменные установлены

---

## 📚 Дополнительные ресурсы

- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Quick Start](./QUICK_START.md)
- [Files Inventory](./FILES_INVENTORY.md)
- [Testing Guide](./TESTING_ALL_MODELS.md)

---

## 🆘 Support

```
Issues?
1. Check Troubleshooting section above ☝️
2. Check logs: npm run dev (watch console)
3. Check API keys in .env
4. Check network connectivity
5. Create GitHub issue with:
   - Error message
   - Reproduction steps
   - Environment variables (без sensitive data)
```

---

**Made with ❤️ for AI orchestration**

Version 2.0.0 | June 18, 2026

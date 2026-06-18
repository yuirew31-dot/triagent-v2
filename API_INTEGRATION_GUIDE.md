# 🔌 Полное руководство по интеграции API для TriAgent v2
**Дата: 18 июня 2026**  
**Цель:** Подключить все модели для тестирования  

---

## 📋 Все доступные API провайдеры

| Модель | Провайдер | Статус | API Ключ | Ссылка |
|--------|-----------|--------|---------|--------|
| **GLM-5.2** | Fireworks AI | ✅ Active | `FIREWORKS_API_KEY` | https://fireworks.ai/account/api-keys |
| **Kimi K2.7** | Fireworks AI | ✅ Active | `FIREWORKS_API_KEY` | https://fireworks.ai/account/api-keys |
| **Qwen-72B** | SiliconFlow | ✅ Free | `SILICONFLOW_API_KEY` | https://cloud.siliconflow.cn/account/ak |
| **DeepSeek V3** | SiliconFlow | ✅ Free | `SILICONFLOW_API_KEY` | https://cloud.siliconflow.cn/account/ak |
| **Gemini 3.5 Flash** | Google AI | ✅ Free | `GEMINI_API_KEY_1` | https://aistudio.google.com/app/apikey |
| **Command R** | Cohere | ✅ Free Trial | `COHERE_API_KEY` | https://dashboard.cohere.com/api-keys |
| **Claude 3.5 Sonnet** | Anthropic | ✅ Paid | `ANTHROPIC_API_KEY` | https://console.anthropic.com/account/keys |
| **Groq LLaMA** | Groq | ✅ Free | `GROQ_API_KEY` | https://console.groq.com/keys |

---

## 🚀 ШАГ 1: Получить все API ключи (15 минут)

### 1.1 **Fireworks AI** ($6.00 баланс - PRIMARY)
**Для моделей:** GLM-5.2, Kimi K2.7

1. Перейди на: https://fireworks.ai
2. Нажми **Sign Up** → создай аккаунт
3. Перейди в **Account** → **API Keys**
4. Нажми **Create API Key**
5. Копируй ключ в формате `fw_xxx`

```env
FIREWORKS_API_KEY="fw_xxxxxxxxxxxxx"
```

**Тестируемые модели:**
- ✅ `accounts/fireworks/models/glm-5-2` (frontend code)
- ✅ `accounts/fireworks/models/kimi-k2-7` (backend architecture)

---

### 1.2 **SiliconFlow** ($1.00 + FREE - FALLBACK)
**Для моделей:** Qwen-72B, DeepSeek V3

1. Перейди на: https://cloud.siliconflow.cn
2. Регистрация → Email верификация
3. **API Keys** → **Create New API Key**
4. Копируй ключ в формате `sk_xxx`

```env
SILICONFLOW_API_KEY="sk_xxxxxxxxxxxxx"
```

**Тестируемые модели:**
- ✅ `Qwen/Qwen-2.5-72B-Instruct` (code generation)
- ✅ `deepseek-ai/DeepSeek-V3` (complex reasoning)
- ✅ `Qwen/Qwen-2.5-Coder-32B-Instruct` (coding tasks)

---

### 1.3 **Google Gemini** (FREE - 50 req/min)
**Для модели:** Gemini 3.5 Flash

1. Перейди на: https://aistudio.google.com/app/apikey
2. Нажми **Create API key**
3. Выбери существующий проект или создай новый
4. Копируй ключ

```env
GEMINI_API_KEY_1="AIzaSy_xxxxxxxxxxxxx"
```

**Тестируемая модель:**
- ✅ `gemini-3.5-flash` (math, analytics, fast responses)

---

### 1.4 **Cohere** (FREE TRIAL)
**Для моделей:** Command R, Embeddings

1. Перейди на: https://dashboard.cohere.com
2. **Sign Up** → Create account
3. **API Keys** → Copy
4. Нажми **Generate API Key**

```env
COHERE_API_KEY="cohere_xxx"
```

**Тестируемые модели:**
- ✅ `command-r-v1:0` (RAG search)
- ✅ `embed-english-v3.0` (embeddings)

---

### 1.5 **Anthropic Claude** (OPTIONAL - Premium)
**Для моделей:** Claude 3.5 Sonnet, Claude 3 Opus

1. Перейди на: https://console.anthropic.com
2. **Account Settings** → **API Keys**
3. **Create Key**
4. Выбери срок действия
5. Копируй ключ

```env
ANTHROPIC_API_KEY="sk-ant-xxx"
```

---

### 1.6 **Groq** (FREE)
**Для моделей:** LLaMA 3.3, Mixtral

1. Перейди на: https://console.groq.com
2. **Keys** → **Create API Key**
3. Копируй ключ

```env
GROQ_API_KEY="gsk_xxx"
```

---

## 🔧 ШАГ 2: Настроить .env файл

### 2.1 Создать `.env` в папке `server/`

```bash
cd server
cp .env.example .env  # или создай новый файл .env
```

### 2.2 Заполнить все API ключи

Открой `server/.env` и добавь:

```env
# ==========================================
# API KEYS - PRIMARY PROVIDERS
# ==========================================

# Fireworks AI ($6.00) - PRIMARY
FIREWORKS_API_KEY="fw_xxxxxxxxxxxxx"

# SiliconFlow ($1.00 + FREE) - FALLBACK
SILICONFLOW_API_KEY="sk_xxxxxxxxxxxxx"

# Google Gemini (FREE, 50 req/min)
GEMINI_API_KEY_1="AIzaSy_xxxxxxxxxxxxx"

# Cohere (FREE TRIAL)
COHERE_API_KEY="cohere_xxx"

# ==========================================
# OPTIONAL: PREMIUM PROVIDERS
# ==========================================

# Anthropic Claude (PAID)
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"

# Groq (FREE)
GROQ_API_KEY="gsk_xxx"

# ==========================================
# DATABASE & SECURITY
# ==========================================

# SQLite Database Path
DB_PATH="triagent.db"

# Encryption Secret (измени в продакшене!)
ENCRYPTION_SECRET="dev-secret-change-in-prod-32ch!!"

# ==========================================
# OPTIONAL: Google OAuth (для аутентификации)
# ==========================================

GOOGLE_OAUTH_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_OAUTH_SECRET="your-client-secret"

# ==========================================
# Server Configuration
# ==========================================

NODE_ENV="development"
PORT=3000
WS_PORT=3000
```

---

## 📂 ШАГ 3: Проверить текущие агенты

Посмотри, какие файлы уже есть в `server/src/agents/`:

```bash
ls -la server/src/agents/
```

Должны быть:
- ✅ `claude.ts` (Anthropic)
- ✅ `groq.ts` (Groq)
- ✅ `glm.ts` (GLM-5)
- ✅ `kimi.ts` (Kimi K2.7)
- ✅ `antigravity.ts` (Google Gemini)
- ❓ `siliconflow.ts` (нужно создать - НОВЫЙ)
- ❓ `cohere-rag.ts` (нужно создать - НОВЫЙ)

---

## 💻 ШАГ 4: Создать/Обновить агентов

### 4.1 Создать `server/src/agents/siliconflow.ts` (НОВЫЙ)

```typescript
import fetch from 'node-fetch';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

const MODELS = {
  'qwen-72b': 'Qwen/Qwen-2.5-72B-Instruct',
  'deepseek-v3': 'deepseek-ai/DeepSeek-V3',
  'qwen-coder': 'Qwen/Qwen-2.5-Coder-32B-Instruct'
};

export async function runSiliconFlow(
  taskId: string,
  prompt: string,
  model: keyof typeof MODELS = 'qwen-72b'
): Promise<void> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'SiliconFlow API key missing');
    return;
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODELS[model],
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data);
          const text = json.choices?.[0]?.delta?.content || '';
          if (text) {
            fullText += text;
            broadcastTaskChunk(taskId, text);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error) {
    console.error('[SiliconFlow]', error);
    broadcastTaskUpdate(taskId, 'error', `SiliconFlow: ${error.message}`);
  }
}
```

---

### 4.2 Обновить `server/src/agents/glm.ts`

Если файл существует, обновь его на версию с fallback на SiliconFlow:

```typescript
import Anthropic from '@anthropic-sdk/sdk';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

export async function runGLM(taskId: string, prompt: string): Promise<void> {
  // Приоритет 1: Fireworks
  const fireworksKey = process.env.FIREWORKS_API_KEY;
  if (fireworksKey) {
    return runGLMFireworks(taskId, prompt);
  }

  // Приоритет 2: SiliconFlow (бесплатно)
  const siliconflowKey = process.env.SILICONFLOW_API_KEY;
  if (siliconflowKey) {
    const { runSiliconFlow } = await import('./siliconflow.js');
    return runSiliconFlow(taskId, prompt, 'qwen-72b');
  }

  broadcastTaskUpdate(taskId, 'error', 'No GLM API keys available');
}

async function runGLMFireworks(taskId: string, prompt: string): Promise<void> {
  const client = new Anthropic({
    apiKey: process.env.FIREWORKS_API_KEY,
    baseURL: 'https://api.fireworks.ai/inference/v1',
  });

  try {
    const stream = await client.messages.stream({
      model: 'accounts/fireworks/models/glm-5-2',
      max_tokens: 4096,
      system: [{
        type: "text",
        text: "You are a world-class frontend developer.",
        cache_control: { type: "ephemeral" }
      }],
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        broadcastTaskChunk(taskId, event.delta.text);
      }
    }

    broadcastTaskUpdate(taskId, 'done', 'GLM completed via Fireworks');
  } catch (error) {
    console.error('[GLM Fireworks]', error);
    const { runSiliconFlow } = await import('./siliconflow.js');
    return runSiliconFlow(taskId, prompt, 'qwen-72b');
  }
}
```

---

### 4.3 Обновить `server/src/agents/kimi.ts`

```typescript
import Anthropic from '@anthropic-sdk/sdk';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

export async function runKimi(taskId: string, prompt: string): Promise<void> {
  // Приоритет 1: Fireworks Kimi K2.7
  const fireworksKey = process.env.FIREWORKS_API_KEY;
  if (fireworksKey) {
    return runKimiFireworks(taskId, prompt);
  }

  // Приоритет 2: SiliconFlow DeepSeek V3 (бесплатно!)
  const siliconflowKey = process.env.SILICONFLOW_API_KEY;
  if (siliconflowKey) {
    const { runSiliconFlow } = await import('./siliconflow.js');
    return runSiliconFlow(taskId, prompt, 'deepseek-v3');
  }

  broadcastTaskUpdate(taskId, 'error', 'No Kimi API keys available');
}

async function runKimiFireworks(taskId: string, prompt: string): Promise<void> {
  const client = new Anthropic({
    apiKey: process.env.FIREWORKS_API_KEY,
    baseURL: 'https://api.fireworks.ai/inference/v1',
  });

  try {
    const stream = await client.messages.stream({
      model: 'accounts/fireworks/models/kimi-k2-7',
      max_tokens: 8192,
      system: [{
        type: "text",
        text: "You are an expert backend architect and system designer.",
        cache_control: { type: "ephemeral" }
      }],
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        broadcastTaskChunk(taskId, event.delta.text);
      }
    }

    broadcastTaskUpdate(taskId, 'done', 'Kimi completed via Fireworks');
  } catch (error) {
    console.error('[Kimi Fireworks]', error);
    const { runSiliconFlow } = await import('./siliconflow.js');
    return runSiliconFlow(taskId, prompt, 'deepseek-v3');
  }
}
```

---

### 4.4 Обновить `server/src/agents/antigravity.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

export async function runAntigravity(taskId: string, prompt: string): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY_1;
  if (!apiKey) {
    broadcastTaskUpdate(taskId, 'error', 'Gemini API key missing');
    return;
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const stream = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      fullText += text;
      broadcastTaskChunk(taskId, text);
    }

    broadcastTaskUpdate(taskId, 'done', fullText);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Antigravity]', message);
    broadcastTaskUpdate(taskId, 'error', `Gemini error: ${message}`);
  }
}
```

---

### 4.5 Создать `server/src/agents/cohere-rag.ts` (НОВЫЙ)

```typescript
import { CohereClient } from 'cohere-ai';
import { broadcastTaskUpdate, broadcastTaskChunk } from '../ws.js';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function runCohereRAG(
  taskId: string,
  query: string,
  documents: string[]
): Promise<void> {
  try {
    broadcastTaskChunk(taskId, '[RAG] Embedding query and documents...\n');

    const embedResponse = await cohere.embed({
      texts: [query, ...documents],
      model: 'embed-english-v3.0',
      inputType: 'search_query',
    });

    const queryEmbedding = embedResponse.embeddings[0];
    const docEmbeddings = embedResponse.embeddings.slice(1);

    // Cosine similarity
    const scores = docEmbeddings.map((doc, i) => ({
      index: i,
      score: cosineSimilarity(queryEmbedding, doc),
      text: documents[i]
    }));

    const topResults = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.text);

    broadcastTaskChunk(taskId, `[RAG] Found ${topResults.length} relevant documents\n`);
    broadcastTaskChunk(taskId, '[RAG] Generating answer...\n\n');

    // RAG через Command R
    const message = `Based on these documents, answer: ${query}\n\nDocuments:\n${topResults.join('\n---\n')}`;
    
    const chatResponse = await cohere.chatStream({
      message,
      model: 'command-r-v1:0',
    });

    for await (const event of chatResponse) {
      if (event.eventType === 'text-generation') {
        broadcastTaskChunk(taskId, event.text);
      }
    }

    broadcastTaskUpdate(taskId, 'done', 'RAG search completed');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Cohere RAG]', message);
    broadcastTaskUpdate(taskId, 'error', `RAG error: ${message}`);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
  const magB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  return dotProduct / (magA * magB);
}
```

---

## 📦 ШАГ 5: Установить зависимости

Если еще не установлены нужные библиотеки:

```bash
cd server
npm install --save @anthropic-sdk/sdk node-fetch cohere-ai @google/generative-ai
```

---

## 🧪 ШАГ 6: Тестирование всех моделей

### 6.1 Запустить проект

```bash
npm run dev
```

### 6.2 Открыть интерфейс

```
http://localhost:5173
```

### 6.3 Тестовые запросы для каждой модели

#### 1️⃣ **GLM-5.2 (Fireworks)** - Frontend
```
Напиши React компонент для галереи изображений с фильтром по типам (используй TypeScript и CSS Modules)
```
**Ожидание:** Быстрый код, ~2-3 сек

#### 2️⃣ **Kimi K2.7 (Fireworks)** - Backend Architecture
```
Спроектируй архитектуру микросервисов для e-commerce платформы с 1M+ users, учитывая масштабируемость и надежность
```
**Ожидание:** Подробный дизайн, ~3-5 сек

#### 3️⃣ **Qwen-72B (SiliconFlow FREE)** - Code Generation
```
Напиши функцию на Python для оптимизации перемещения данных между базами данных
```
**Ожидание:** Рабочий код, полностью бесплатно

#### 4️⃣ **DeepSeek V3 (SiliconFlow FREE)** - Complex Reasoning
```
Решись парадокс: если Бог всемогущ, может ли Он создать камень, который не сможет поднять?
```
**Ожидание:** Философский анализ, FREE

#### 5️⃣ **Gemini 3.5 Flash (Google FREE)** - Math
```
Найди все простые числа до 1000 и рассчитай их среднее значение
```
**Ожидание:** Математические вычисления, 100% FREE (50 req/min)

#### 6️⃣ **Command R (Cohere FREE)** - RAG Search
```
В документации Node.js найди информацию про EventEmitter
```
**Ожидание:** Семантический поиск, FREE Trial

---

## 📊 Приоритеты API и распределение нагрузки

```
┌─────────────────────────────────────────┐
│ Приоритет использования API             │
├─────────────────────────────────────────┤
│ Tier 1: FREE ($0) - 60%                 │
│  ├─ Google Gemini (50 req/min)         │
│  ├─ SiliconFlow Qwen/DeepSeek          │
│  └─ Cohere Trial RAG                   │
│                                         │
│ Tier 2: CHEAP ($1-3) - 30%              │
│  ├─ Fireworks GLM-5.2 ($0.50/task)     │
│  └─ Fireworks Kimi ($0.30/task)        │
│                                         │
│ Tier 3: PREMIUM - 10%                   │
│  └─ Anthropic Claude (если нужно)      │
└─────────────────────────────────────────┘
```

---

## 🔍 Отладка и проверки

### Проверить все ключи установлены:

```bash
# В папке server/
echo "Fireworks: $FIREWORKS_API_KEY"
echo "SiliconFlow: $SILICONFLOW_API_KEY"
echo "Gemini: $GEMINI_API_KEY_1"
echo "Cohere: $COHERE_API_KEY"
```

### Тестировать каждый API отдельно:

#### Fireworks GLM:
```bash
curl -X POST https://api.fireworks.ai/inference/v1/chat/completions \
  -H "Authorization: Bearer $FIREWORKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "accounts/fireworks/models/glm-5-2",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 100
  }'
```

#### SiliconFlow Qwen:
```bash
curl -X POST https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer $SILICONFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen-2.5-72B-Instruct",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 100
  }'
```

#### Google Gemini:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$GEMINI_API_KEY_1" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

#### Cohere:
```bash
curl -X POST https://api.cohere.com/v1/generate \
  -H "Authorization: Bearer $COHERE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Say hello",
    "max_tokens": 100
  }'
```

---

## 💰 Прогноз расходов (на месяц)

| Сценарий | Стоимость | Модели |
|----------|-----------|--------|
| **Только FREE** | **$0** | Gemini, SiliconFlow, Cohere |
| **+Fireworks базовый** | **$3-5** | GLM + Kimi (10 tasks/день) |
| **+Anthropic Claude** | **$10-20** | Все + Premium backup |
| **Production с кешированием** | **$5-15** | Оптимизация через кеш |

---

## ✅ Чек-лист интеграции

- [ ] Создать все 6 API ключей
- [ ] Заполнить `server/.env` файл
- [ ] Создать `siliconflow.ts`
- [ ] Создать `cohere-rag.ts`
- [ ] Обновить `glm.ts` с fallback
- [ ] Обновить `kimi.ts` с fallback
- [ ] Обновить `antigravity.ts`
- [ ] Установить npm пакеты
- [ ] Запустить `npm run dev`
- [ ] Протестировать все 6 моделей
- [ ] Проверить логи в console

---

## 🚀 Следующие шаги

1. ✅ Интегрировать все API (30 мин)
2. 📊 Добавить UI для выбора модели (1 час)
3. 📈 Добавить мониторинг расходов (1 час)
4. 🧠 Умное распределение задач (2 часа)
5. 🎯 Multi-agent orchestration (3 часа)

---

**Успехов с тестированием! 🎉**

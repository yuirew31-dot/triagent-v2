# 🔗 Быстрая справка: API Endpoints и URLs

**Скопируй любую команду ниже для прямого тестирования API**

---

## 🌐 API Endpoints

### 1️⃣ **Fireworks AI** (GLM & Kimi)

**Получить ключ:** https://fireworks.ai/account/api-keys

**Endpoint:**
```
POST https://api.fireworks.ai/inference/v1/chat/completions
```

**cURL Пример (GLM-5.2):**
```bash
curl -X POST https://api.fireworks.ai/inference/v1/chat/completions \
  -H "Authorization: Bearer $FIREWORKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "accounts/fireworks/models/glm-5-2",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Write a React component"
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'
```

**cURL Пример (Kimi K2.7):**
```bash
curl -X POST https://api.fireworks.ai/inference/v1/chat/completions \
  -H "Authorization: Bearer $FIREWORKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "accounts/fireworks/models/kimi-k2-7",
    "messages": [{"role": "user", "content": "Design microservices architecture"}],
    "max_tokens": 8000
  }'
```

**Доступные модели:**
- ✅ `accounts/fireworks/models/glm-5-2` (Frontend)
- ✅ `accounts/fireworks/models/kimi-k2-7` (Backend)
- ✅ `accounts/fireworks/models/llama-v3-8b-instruct`
- ✅ `accounts/fireworks/models/qwen-2.5-72b-instruct`

---

### 2️⃣ **SiliconFlow** (FREE Models)

**Получить ключ:** https://cloud.siliconflow.cn/account/ak

**Endpoint:**
```
POST https://api.siliconflow.cn/v1/chat/completions
```

**cURL Пример (Qwen-72B):**
```bash
curl -X POST https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer $SILICONFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen-2.5-72B-Instruct",
    "messages": [{"role": "user", "content": "Write Python code"}],
    "stream": false,
    "max_tokens": 4096
  }'
```

**cURL Пример (DeepSeek-V3):**
```bash
curl -X POST https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer $SILICONFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-ai/DeepSeek-V3",
    "messages": [{"role": "user", "content": "Solve this reasoning problem..."}],
    "max_tokens": 4096
  }'
```

**Доступные модели:**
- ✅ `Qwen/Qwen-2.5-72B-Instruct` (Code, General)
- ✅ `deepseek-ai/DeepSeek-V3` (Reasoning, Complex)
- ✅ `Qwen/Qwen-2.5-Coder-32B-Instruct` (Coding)
- ✅ `THUDM/glm-4-9b-chat` (General)
- ✅ `Qwen/Qwen-2.5-Quantum-Instruct` (Experimental)

**Pricing:** Completely FREE for inference! ✅

---

### 3️⃣ **Google Gemini** (FREE - 50 req/min)

**Получить ключ:** https://aistudio.google.com/app/apikey

**Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}
```

**cURL Пример:**
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$GEMINI_API_KEY_1" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Find all prime numbers up to 1000"
          }
        ]
      }
    ],
    "generationConfig": {
      "maxOutputTokens": 1024,
      "temperature": 0.7
    }
  }'
```

**Доступные модели:**
- ✅ `gemini-3.5-flash` (Fast, Cheap)
- ✅ `gemini-2.0-flash` (Older version)
- ✅ `gemini-1.5-pro` (Premium)

**Ограничения:**
- 50 requests/minute
- 1500 requests/day
- FREE forever ✅

---

### 4️⃣ **Cohere** (FREE Trial)

**Получить ключ:** https://dashboard.cohere.com/api-keys

**Endpoint:**
```
POST https://api.cohere.com/v1/generate
POST https://api.cohere.com/v1/embed
```

**cURL Пример (Generate):**
```bash
curl -X POST https://api.cohere.com/v1/generate \
  -H "Authorization: Bearer $COHERE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a product description for a new coffee maker",
    "max_tokens": 100,
    "temperature": 0.8
  }'
```

**cURL Пример (Embeddings):**
```bash
curl -X POST https://api.cohere.com/v1/embed \
  -H "Authorization: Bearer $COHERE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["Hello world", "How are you?"],
    "model": "embed-english-v3.0",
    "input_type": "search_document"
  }'
```

**Доступные модели:**
- ✅ `command-r-v1:0` (Generation & RAG)
- ✅ `command-r-plus` (Premium)
- ✅ `embed-english-v3.0` (Embeddings)
- ✅ `rerank-english-v3.0` (Reranking)

---

### 5️⃣ **Groq** (FREE)

**Получить ключ:** https://console.groq.com/keys

**Endpoint:**
```
POST https://api.groq.com/openai/v1/chat/completions
```

**cURL Пример:**
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mixtral-8x7b-32768",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "max_tokens": 1024
  }'
```

**Доступные модели:**
- ✅ `mixtral-8x7b-32768` (Fast, Free)
- ✅ `llama-3.3-70b-versatile` (Large)
- ✅ `gemma2-9b-it` (Small)

---

### 6️⃣ **Anthropic Claude** (PAID - Optional)

**Получить ключ:** https://console.anthropic.com/account/keys

**Endpoint:**
```
POST https://api.anthropic.com/v1/messages
```

**cURL Пример:**
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Explain machine learning"
      }
    ]
  }'
```

**Доступные модели:**
- ✅ `claude-3-5-sonnet-20241022` (Best balance)
- ✅ `claude-3-opus-20250219` (Most powerful)
- ✅ `claude-3-haiku-20250307` (Fastest)

---

## 🧪 Скрипт для тестирования всех API

### Bash скрипт (test_all_apis.sh)

```bash
#!/bin/bash

echo "🧪 Testing all TriAgent APIs..."

# Test Fireworks
echo "1️⃣ Testing Fireworks GLM..."
curl -s -X POST https://api.fireworks.ai/inference/v1/chat/completions \
  -H "Authorization: Bearer $FIREWORKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "accounts/fireworks/models/glm-5-2", "messages": [{"role": "user", "content": "Hi"}], "max_tokens": 100}' | jq '.choices[0].message.content'

# Test SiliconFlow
echo "2️⃣ Testing SiliconFlow Qwen..."
curl -s -X POST https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer $SILICONFLOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "Qwen/Qwen-2.5-72B-Instruct", "messages": [{"role": "user", "content": "Hi"}], "max_tokens": 100}' | jq '.choices[0].message.content'

# Test Gemini
echo "3️⃣ Testing Google Gemini..."
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$GEMINI_API_KEY_1" \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "Hi"}]}]}' | jq '.content.parts[0].text'

# Test Cohere
echo "4️⃣ Testing Cohere..."
curl -s -X POST https://api.cohere.com/v1/generate \
  -H "Authorization: Bearer $COHERE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hi", "max_tokens": 100}' | jq '.generations[0].text'

# Test Groq
echo "5️⃣ Testing Groq..."
curl -s -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "mixtral-8x7b-32768", "messages": [{"role": "user", "content": "Hi"}], "max_tokens": 100}' | jq '.choices[0].message.content'

echo "✅ All API tests completed!"
```

**Использование:**
```bash
chmod +x test_all_apis.sh
./test_all_apis.sh
```

---

## 📊 Сравнение стоимости (за 1000 токенов)

| API | Input | Output | Примечание |
|-----|-------|--------|-----------|
| Fireworks GLM | $0.33 | $0.33 | Можно кешировать (-70%) |
| Fireworks Kimi | $0.25 | $0.25 | Кеширование доступно |
| SiliconFlow | FREE | FREE | Полностью бесплатно! ✅ |
| Gemini | FREE | FREE | 50 req/min ✅ |
| Cohere | FREE | FREE | Trial ✅ |
| Groq | FREE | FREE | Без ограничений ✅ |
| Claude 3.5 | $3.00 | $15.00 | Самый дорогой |

---

## 🔐 Безопасность API ключей

### ✅ ДЕЛАЙ:
```env
FIREWORKS_API_KEY="fw_xxxxxxxxxxxxx"  # Одинарные или двойные кавычки
SILICONFLOW_API_KEY="sk_xxxxxx"       # Скрыт в .env
```

### ❌ НЕ ДЕЛАЙ:
```env
FIREWORKS_API_KEY=fw_xxxx             # Без кавычек
export FIREWORKS_API_KEY="fw_xxxx"    # В коммит
# FIREWORKS_API_KEY="fw_xxxx"         # В коде
```

### 🛡️ Защита:
```bash
# 1. Добавить .env в .gitignore
echo "server/.env" >> .gitignore

# 2. Никогда не коммитить ключи
git add .
git reset server/.env  # Исключить .env из коммита

# 3. Ротировать ключи регулярно
# Для каждого провайдера есть опция "Revoke" в dashboard
```

---

## 🚀 Использование в коде TypeScript

```typescript
// Fireworks
const fireworksKey = process.env.FIREWORKS_API_KEY;
const client = new Anthropic({
  apiKey: fireworksKey,
  baseURL: 'https://api.fireworks.ai/inference/v1',
});

// SiliconFlow
const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
  }
});

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_1);

// Cohere
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

// Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
```

---

**Последний апдейт:** 18 июня 2026

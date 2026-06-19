# 🚀 Render Deployment Guide - Free Tier

**Deploy TriAgent v2 to Render for free with full functionality!**

---

## ⚠️ Important: Render Free Tier Limits

### ✅ What You Get (Free)
- **1 Web Service** + **1 Static Site** (both free)
- **512 MB RAM** + **0.5 vCPU**
- **PostgreSQL Database** (90 days free)
- **Auto-deploy** from GitHub
- **HTTPS SSL/TLS** included
- **5GB/month bandwidth** (usually enough)

### ⚠️ Limitations to Know
- **Spins down after 15 min inactivity** (first request takes 30-60s)
- **1 concurrent connection** for builds
- **No persistent storage** (database resets if service restarts)
- **Limited CPU/RAM** (affects large AI responses)

### 🎯 Best Use Case
- Development/Testing
- Low-traffic demo
- Personal projects
- POC/Prototyping

---

## 🔧 Preparation (5 minutes)

### 1️⃣ Check Your Repository

Your GitHub repo must be **public** (or add Render as collaborator).

```bash
cd d:\Lev\PythonProjects\triagent-v2
git remote -v
```

If no remote:
```bash
git init
git add .
git commit -m "TriAgent v2 - Ready for Render"
git branch -M main

# Create repo on GitHub first!
# https://github.com/new
# Name: triagent-v2
# Public repository

git remote add origin https://github.com/YOUR_USERNAME/triagent-v2.git
git push -u origin main
```

### 2️⃣ Create `.env.production` in server folder

```bash
# Create: server/.env.production

# API Keys (copy from your local .env)
FIREWORKS_API_KEY=your_fireworks_key
SILICONFLOW_API_KEY=your_siliconflow_key
GEMINI_API_KEY_1=your_gemini_key_1
GEMINI_API_KEY_2=your_gemini_key_2
COHERE_API_KEY=your_cohere_key
GROQ_API_KEY=your_groq_key
ANTHROPIC_API_KEY=your_claude_key

# Server Config
NODE_ENV=production
PORT=10000
HOST=0.0.0.0

# Database (Render will provide)
DATABASE_URL=postgresql://...  # Render sets this automatically

# Optional: Performance tweaks for free tier
MAX_CONCURRENT_TASKS=2
CACHE_MAX_SIZE=100
CONTEXT_COMPRESSION_ENABLED=true
```

### 3️⃣ Update `server/package.json`

Make sure these exist:
```json
{
  "name": "triagent-server",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": "20"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "axios": "^1.6.0"
  }
}
```

---

## 🚀 Deploy Backend to Render (10 minutes)

### Step 1: Go to Render
Open: **https://dashboard.render.com**
- Sign up with GitHub
- Authorize Render

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Click **"Connect"** next to your GitHub repo
4. Search: `triagent-v2`
5. Click **"Connect"** on the repo

### Step 3: Configure Service

| Field | Value |
|-------|-------|
| **Name** | `triagent-api` |
| **Environment** | `Node` |
| **Region** | `Ohio (Free tier)` or `Frankfurt` |
| **Branch** | `main` |
| **Build Command** | `cd server && npm install && npm run build` |
| **Start Command** | `cd server && npm start` |
| **Plan** | `Free` ✅ |

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each variable:
```
FIREWORKS_API_KEY = your_fireworks_key
SILICONFLOW_API_KEY = your_siliconflow_key
GEMINI_API_KEY_1 = your_gemini_key_1
GEMINI_API_KEY_2 = your_gemini_key_2
COHERE_API_KEY = your_cohere_key
GROQ_API_KEY = your_groq_key
ANTHROPIC_API_KEY = your_claude_key
NODE_ENV = production
PORT = 10000
HOST = 0.0.0.0
```

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Wait for build (5-10 minutes)
3. ✅ Get URL: `https://triagent-api.render.com`

**Test API**:
```bash
curl https://triagent-api.render.com/health
# Should return: { "status": "ok" }
```

---

## 🎨 Deploy Frontend to Render Static Site (5 minutes)

### Step 1: Build Frontend

```bash
cd d:\Lev\PythonProjects\triagent-v2\client
npm install
npm run build
```

Creates `dist/` folder with static files.

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add frontend build"
git push origin main
```

### Step 3: Create Static Site on Render

1. Click **"New +"** → **"Static Site"**
2. Select GitHub repo: `triagent-v2`
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `triagent-dashboard` |
| **Region** | `Ohio` |
| **Branch** | `main` |
| **Build Command** | `cd client && npm install && npm run build` |
| **Publish Directory** | `client/dist` |
| **Plan** | `Free` ✅ |

### Step 4: Add Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**
```
VITE_API_URL = https://triagent-api.render.com
```

### Step 5: Deploy!

1. Click **"Create Static Site"**
2. Wait for build (2-3 minutes)
3. ✅ Get URL: `https://triagent-dashboard.render.com`

---

## 🔗 Connect Frontend to Backend

### Option A: Update Frontend Env (If using Vite)

Edit `client/.env.production`:
```
VITE_API_URL=https://triagent-api.render.com
```

Build and commit:
```bash
cd client
npm run build
git add dist/
git commit -m "Update API URL"
git push origin main
```

Render auto-redeploys! ✅

### Option B: Update in Render Dashboard

1. Go to `triagent-dashboard` on Render
2. Click **"Environment"**
3. Update: `VITE_API_URL=https://triagent-api.render.com`
4. Click **"Deploy Latest"**

---

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl https://triagent-api.render.com/health

# Get metrics
curl https://triagent-api.render.com/api/metrics

# Create task
curl -X POST https://triagent-api.render.com/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the capital of France?",
    "agent": "auto"
  }'
```

### Test Frontend
Open: `https://triagent-dashboard.render.com`
- Should see the interface
- Should connect to API
- Create a test task

---

## ⚡ Handling Free Tier Spin-Downs

### Problem
Service spins down after 15 min inactivity. First request after spin-down takes 30-60s.

### Solutions

**Option 1: Use Render Cron Jobs (Recommended)**
1. Go to your Web Service → **"Cron Jobs"**
2. Click **"Add Cron Job"**
3. Configure:
   - **Name**: `Keep-Alive Ping`
   - **Frequency**: `Every hour`
   - **Command**: `curl https://triagent-api.render.com/health`

This keeps the service warm! ✅

**Option 2: Manual Keep-Alive**
```bash
# Run this periodically to prevent spin-down
while true; do
  curl https://triagent-api.render.com/health
  sleep 600  # Every 10 minutes
done
```

**Option 3: Accept the Delay**
- First request: 30-60s
- Subsequent: <100ms
- Works fine for demos/testing

---

## 📊 Monitoring

### View Logs

1. Go to Web Service on Render
2. Click **"Logs"** tab
3. See real-time output

### Check Deployment Status

1. Click **"Events"** tab
2. See build history and errors
3. Click a deployment to see details

### Monitor Performance

```bash
# Check response time
time curl https://triagent-api.render.com/health

# Load test (careful on free tier!)
for i in {1..5}; do
  curl https://triagent-api.render.com/api/metrics &
done
wait
```

---

## 🐛 Troubleshooting

### Build Fails: "Node version error"

**Fix**: Update `server/package.json`:
```json
{
  "engines": {
    "node": "20"
  }
}
```

### Build Fails: "Cannot find module"

**Fix**: Ensure `package-lock.json` is committed:
```bash
cd server
npm install
git add package-lock.json
git commit -m "Add lock file"
git push origin main
```

### API Returns 503 Service Unavailable

**Cause**: Service is spinning up
**Fix**: Wait 30-60 seconds, then retry

### Frontend Can't Connect to API

**Check**:
1. Is backend URL correct in `.env.production`?
2. Are API keys valid?
3. Check browser console for CORS errors
4. Verify database connection in backend logs

```bash
# Debug: Check if API is responding
curl https://triagent-api.render.com/health
```

### Database Issues

**Check Render PostgreSQL**:
1. Go to Web Service → **"Data"** tab
2. If database exists, get connection string
3. Update `.env.production` with DATABASE_URL

---

## 🆓 Free Tier Cost

| Service | Cost | Notes |
|---------|------|-------|
| Web Service | **FREE** | 512MB RAM, 0.5 vCPU |
| Static Site | **FREE** | Unlimited bandwidth |
| PostgreSQL | **FREE** | 90 days, then $7-15/mo |
| **Total** | **$0/month** | For first 3 months |

After 90 days:
- Upgrade database to paid ($7/mo) OR
- Use Railway, Railway YAML, or other provider

---

## 📈 Scaling When Ready

When free tier isn't enough:

### Option 1: Render Paid Plan ($7/mo minimum)
- More RAM/CPU
- Persistent databases
- No spin-downs
- Better performance

### Option 2: Switch to Railway
- Better free tier for Node.js
- GitHub deploy built-in
- More flexible pricing

### Option 3: Docker + VPS
- DigitalOcean ($5/mo)
- Full control
- Better performance

---

## ✅ Deployment Checklist

- [ ] GitHub repo created and public
- [ ] `.env.production` configured in `server/`
- [ ] `package.json` has correct build commands
- [ ] All API keys added to Render environment
- [ ] Backend deployed and shows green status
- [ ] Frontend deployed and shows green status
- [ ] Health check working: `curl /health`
- [ ] Frontend connects to backend
- [ ] Created test task successfully
- [ ] Cron job set up for keep-alive (optional)

---

## 🎉 You're Done!

### Your Live URLs:
```
Frontend:  https://triagent-dashboard.render.com
Backend:   https://triagent-api.render.com
API Health: https://triagent-api.render.com/health
```

### Next Steps:
1. **Test thoroughly** with real tasks
2. **Monitor logs** for errors
3. **Track API costs** (free tier quota)
4. **Plan upgrade** when ready

### Need Help?
- Render Docs: https://render.com/docs
- Check logs in Render dashboard
- Test individual API endpoints

---

## 📝 Quick Reference

### Redeploy After Code Changes
```bash
# 1. Make changes locally
# 2. Commit and push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# 3. Render auto-deploys in 1-2 minutes
# 4. Check Events tab on Render dashboard
```

### Update Environment Variables
1. Render dashboard
2. Web Service or Static Site
3. Click "Environment"
4. Edit variables
5. Click "Deploy Latest"

### View Live Logs
```bash
# In Render dashboard
Web Service → Logs → Real-time output
```

---

**Happy Deploying! 🚀**

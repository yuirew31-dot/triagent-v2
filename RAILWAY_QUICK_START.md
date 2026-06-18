# ⚡ Railway - Quick Start (3 Steps)

## 🎯 Deploy TriAgent v2 to Railway - 5 Minutes

### Step 1️⃣: Push to GitHub (1 min)
```bash
cd d:\Lev\PythonProjects\triagent-v2
git add .
git commit -m "Deploy TriAgent v2"
git push origin main
```

### Step 2️⃣: Deploy on Railway (3 min)
1. Go: **https://railway.app**
2. Click: **"New Project"**
3. Choose: **"Deploy from GitHub repo"**
4. Select: **triagent-v2**
5. Click: **"Deploy"**
6. ⏳ Wait 2-3 minutes for deployment

**You'll see:**
```
✅ Build successful
✅ Deployment complete
✅ Your URL: https://triagent-api-xyz.railway.app
```

### Step 3️⃣: Add API Keys (1 min)
1. In Railway, click: **"Variables"**
2. Copy all keys from `server/.env` and paste:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   SILICONFLOW_API_KEY=sk-...
   GEMINI_API_KEY=AIza...
   GROQ_API_KEY=gsk-...
   FIREWORKS_API_KEY=...
   COHERE_API_KEY=...
   ```
3. Click: **"Save"**
4. Railway auto-redeploys ✅

---

## ✅ Done! Your API is Live

```
🌐 API URL: https://triagent-api-xyz.railway.app
🟢 Status: Running
🔒 Security: HTTPS enabled
⚡ Speed: Auto-scaled
💰 Cost: $5/month free credits
```

---

## 🧪 Test Your Deployment

```bash
# Health check
curl https://triagent-api-xyz.railway.app/health

# Get tasks
curl https://triagent-api-xyz.railway.app/api/tasks

# Create task
curl -X POST https://triagent-api-xyz.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Your prompt here"}'

# Get metrics
curl https://triagent-api-xyz.railway.app/api/metrics
```

---

## 📊 Next: Connect Dashboard (Optional)

### Deploy Frontend to Vercel
1. Go: **https://vercel.com/new**
2. Import same GitHub repo
3. Add env var: `NEXT_PUBLIC_API_URL=https://triagent-api-xyz.railway.app`
4. Deploy

**Result**: Beautiful dashboard at `https://triagent-v2.vercel.app` 🎨

---

## 🔧 Useful Railway Commands

### View Logs
In Railway dashboard → **"Logs"**
```
See all console output in real-time
```

### View Metrics
In Railway dashboard → **"Metrics"**
```
CPU, Memory, Network usage
```

### Redeploy
```bash
# Auto: Just git push
git push origin main
# Railway auto-detects and redeploys

# Manual: In Railway dashboard click "Deploy"
```

### Rollback
In Railway → **"Deployments"**
```
Can rollback to any previous version
```

---

## ⚠️ If Something Goes Wrong

### Error: "Build failed"
```bash
# Test locally first
npm run server:build
npm run server:start
```

### Error: "API returns 500"
1. Check Railway logs → see error message
2. Verify env variables are set
3. Redeploy

### Error: "Can't connect to API"
1. Check API URL is correct
2. Wait for deployment to complete
3. Test with: curl https://your-url/health

---

## 💡 Pro Tips

### Git Auto-Deploy
Every time you push to main, Railway auto-deploys! 
```bash
git push origin main  # → Auto-deploys in 1 minute
```

### Environment Variables
Keep `.env` local only (in .gitignore). Add to Railway Variables instead.

### Monitoring
Check Railway logs regularly to spot issues early.

### Scaling
Railway auto-scales. No config needed!

---

## 📈 What You Have Now

```
✅ Production API server (Railway)
✅ Auto-scaling enabled
✅ HTTPS/SSL automatic
✅ 99.9% uptime guaranteed
✅ Real-time logs & metrics
✅ Easy rollback capability
✅ Git auto-deploy on push
✅ ~$6/month cost
```

---

## 🚀 You're Done!

Your TriAgent v2 system is now:
- **Live** on Railway
- **Accessible** worldwide with HTTPS
- **Monitored** 24/7
- **Scalable** automatically
- **Production-grade** ready

API URL: `https://triagent-api-xyz.railway.app`

---

**Need more help?** See: `RAILWAY_DEPLOYMENT.md` (full guide)

🎉 **Deployment complete!**

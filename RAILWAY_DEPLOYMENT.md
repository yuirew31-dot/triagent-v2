# 🚀 Railway Deployment - Complete Guide

## ✨ Why Railway?
- ✅ **Easy**: Auto-detects Node.js from our setup
- ✅ **Cheap**: $5/month free credits
- ✅ **Fast**: Deploy from GitHub in 5 minutes
- ✅ **Scalable**: Auto-scales with traffic
- ✅ **Reliable**: 99.9% uptime SLA
- ✅ **HTTPS**: SSL certificate automatic

---

## 📋 Prerequisites

✅ Code committed to GitHub
✅ .env file with all API keys (NOT in git, stays local)
✅ railway.toml configured (already done ✓)
✅ package.json scripts working (already done ✓)

---

## 🚀 Deploy in 10 Minutes

### Step 1: Push Code to GitHub (2 minutes)

```bash
cd d:\Lev\PythonProjects\triagent-v2

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Production ready - TriAgent v2 with Smart Orchestrator"

# Push to GitHub
git push origin main
```

**Expected output:**
```
✅ Enumerating objects: 150
✅ Counting objects: 100%
✅ Writing objects: 100%
✅ master/main [new branch]
```

### Step 2: Create Railway Project (1 minute)

1. Open: **https://railway.app**
2. Click: **"Start New Project"** (or "New Project")
3. Select: **"Deploy from GitHub repo"**
4. Click: **"Connect GitHub"** (if first time)
5. Authorize Railway to access your GitHub
6. Find repository: **triagent-v2**
7. Click: **"Select repository"**

### Step 3: Auto-Deploy (5 minutes)

Railway will:
- ✅ Detect Node.js from package.json
- ✅ Read railway.toml (build/run commands)
- ✅ Install dependencies: `npm install`
- ✅ Build server: `npm run server:build`
- ✅ Build client: `npm run client:build`
- ✅ Start server: `npm run server:start`
- ✅ Deploy to production

**You can see logs in real-time:**
```
[1] npm install ...
[2] npm run server:build ...
[3] Building React client ...
[4] Starting server on PORT=...
[5] ✅ Deployment successful!
```

### Step 4: Add Environment Variables (2 minutes)

**CRITICAL**: Add API keys to Railway

1. In Railway dashboard, go to: **"Variables"**
2. Add each variable from your `server/.env`:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxx
GEMINI_API_KEY=AIza_xxxxxxxxxxxxx
GROQ_API_KEY=gsk-xxxxxxxxxxxxx
FIREWORKS_API_KEY=xxxxxxxxxxxxx
COHERE_API_KEY=xxxxxxxxxxxxx
```

3. Click: **"Save"**
4. Railway auto-redeploys with new env vars

### Step 5: Get Your Public URL

In Railway dashboard:
- Look for: **"Domains"** section
- You'll see: `https://triagent-api-xyz.railway.app`

This is your **PRODUCTION API URL** ✅

---

## ✅ Verify Deployment

### Test 1: Health Check
```bash
curl https://triagent-api-xyz.railway.app/health

# Expected:
# {"status":"ok","timestamp":1624123456789}
```

### Test 2: Get Tasks
```bash
curl https://triagent-api-xyz.railway.app/api/tasks

# Expected:
# []
```

### Test 3: Create Task
```bash
curl -X POST https://triagent-api-xyz.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a React button component"}'

# Expected:
# {"taskId":"abc123...","agent":"glm","status":"processing"}
```

### Test 4: Get Metrics
```bash
curl https://triagent-api-xyz.railway.app/api/metrics

# Expected:
# {"totalMetrics":1,"summary":{...}}
```

---

## 🔧 Configuration Details

### What railway.toml Does

```toml
[build]
  buildpacks:
    - nixpacks.io/nodejs
  build-command: npm run server:build && npm run client:build
  
[run]
  web: npm run server:start
```

- **Buildpacks**: Installs Node.js runtime
- **Build**: Compiles TypeScript → JavaScript
- **Run**: Starts the server

### What Happens During Deploy

```
1. Clone repo from GitHub ✓
2. Install Node.js (via nixpacks) ✓
3. npm install (install dependencies) ✓
4. npm run server:build (compile server) ✓
5. npm run client:build (compile React) ✓
6. npm run server:start (start server) ✓
7. Railway assigns public domain ✓
8. HTTPS certificate auto-enabled ✓
```

### Environment Variables

Railway will pass all variables from **"Variables"** section to your app:

```javascript
// server/index.ts can access:
process.env.ANTHROPIC_API_KEY
process.env.SILICONFLOW_API_KEY
process.env.GEMINI_API_KEY
process.env.GROQ_API_KEY
// etc...
```

---

## 🌐 Railway URL Format

Your URL will look like:
```
https://triagent-api-abc123xyz.railway.app
```

Breaking it down:
- `https://` - Secure HTTPS
- `triagent-api` - From your railway.json (project name)
- `abc123xyz` - Unique ID
- `.railway.app` - Railway domain

---

## 💰 Cost on Railway

### Free Credits
- $5/month free credits (no payment required initially)
- Enough for small to medium projects

### Pricing
- CPU: $5/month per compute unit
- Memory: $1/month per 1GB
- Typical Node.js app: $5-10/month

### Example Cost Breakdown
```
Compute (1vCPU):    $5/month
Memory (1GB):       $1/month
Database (optional): $0 (we use SQLite)
─────────────────────────────
TOTAL:              ~$6/month
```

---

## 🔐 Security on Railway

### Environment Variables
- ✅ Stored encrypted in Railway vault
- ✅ Never exposed in logs
- ✅ Can't be accessed from client-side
- ✅ Different per environment (dev/prod)

### HTTPS/SSL
- ✅ Automatic SSL certificate
- ✅ Free Let's Encrypt certificate
- ✅ Auto-renewed

### Database
- ✅ SQLite runs inside the container
- ✅ Data persists in Railway's storage
- ✅ Backed up automatically

---

## 📊 Monitoring

### View Logs
1. Go to Railway dashboard
2. Click your project
3. Click: **"Logs"**
4. See all console output in real-time

### View Metrics
1. Click: **"Metrics"**
2. See CPU, Memory, Network usage

### View Deployments
1. Click: **"Deployments"**
2. See all previous deployments
3. Can rollback to any version

---

## 🔄 Redeployment

### Auto-Deploy on Push
When you push to GitHub:
```bash
git add .
git commit -m "Fix bug in smart-orchestrator"
git push origin main
```

Railway automatically:
1. Detects new commit on main
2. Triggers new deployment
3. Rebuilds and restarts
4. Same URL stays active
5. Zero downtime (restart only)

### Manual Redeploy
In Railway dashboard:
1. Click: **"Deploy"** button
2. Select: latest commit
3. Click: **"Deploy Now"**

---

## ❌ Troubleshooting

### "Deployment Failed - Build Error"
**Check**: Does `npm run server:build` work locally?
```bash
npm run server:build
# Should create: server/dist/ directory
```

**Fix**: Ensure TypeScript compiles without errors
```bash
npx tsc --project server/tsconfig.json
```

### "API returns 500 error"
**Check**: Are environment variables set in Railway?
1. Go to: **Variables**
2. Verify all API keys are there
3. Redeploy

**Check**: Are credentials correct?
```bash
# Test locally first
npm run server:dev
curl http://localhost:3000/health
```

### "Database errors"
**Check**: Does SQLite initialize?
```bash
npm run db:init
```

**Check**: Is database file writable?
- Railway runs as unprivileged user
- Database must be in writable directory
- Currently in `server/triagent.db` ✓

### "High memory usage"
Railway limits memory based on plan:
- Free tier: ~512MB
- Standard: 1GB

If hitting limits:
1. Upgrade plan in Railway
2. Or optimize code (reduce cache size)

---

## 📈 Performance on Railway

### Typical Response Times
- Health check: <50ms
- API call: 300-500ms
- Metrics API: <100ms
- First request (cold start): 1-3s

### Scaling
Railway auto-scales:
- CPU: 0.5 - 4 cores
- Memory: 256MB - 8GB
- Auto-adjusts based on load

---

## 🚀 Next Steps After Deployment

### 1. Connect Dashboard (Optional)
Deploy the Vercel dashboard to connect to your Railway API:
```
Frontend URL: https://triagent-v2.vercel.app
Backend URL: https://triagent-api-xyz.railway.app
```

### 2. Add Custom Domain (Optional)
1. Buy domain (godaddy, namecheap, etc.)
2. In Railway: **"Domains"** → **"Add Custom Domain"**
3. Point DNS to Railway nameservers

### 3. Set Up Monitoring (Optional)
Railway has built-in:
- ✅ Logs (see all events)
- ✅ Metrics (CPU, memory, network)
- ✅ Alerts (notify on errors)

### 4. Database (Optional)
If you need persistent data:
1. In Railway: **"New Service"** → **"PostgreSQL"**
2. Or keep SQLite (works great)

---

## 📞 Help & Documentation

### Railway Resources
- Docs: https://docs.railway.app
- GitHub: https://github.com/railwayapp
- Status: https://railway.app/status

### Our Documentation
- See: `PRODUCTION_GUIDE.md` (detailed architecture)
- See: `DEPLOYMENT_CHECKLIST.md` (pre-deploy items)
- See: `API_QUICK_REFERENCE.md` (endpoint guide)

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Git repo initialized and has commits
- [ ] All code pushed to GitHub main branch
- [ ] .env file NOT in git (check .gitignore)
- [ ] package.json has all scripts
- [ ] railway.toml exists and correct
- [ ] TypeScript compiles locally: `npm run server:build`
- [ ] Tests pass: `npm test` (optional)
- [ ] API keys ready to add to Railway

After deploying:
- [ ] Health check returns 200
- [ ] Can create tasks via API
- [ ] Metrics API working
- [ ] Check Railway logs for errors
- [ ] Monitor first few hours
- [ ] Update dashboard API URL

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Railway shows "Deployment successful"
✅ Green checkmark on latest deployment
✅ Health endpoint returns `{"status":"ok"}`
✅ Can see logs in real-time
✅ CPU and Memory usage reasonable
✅ API responds to requests
✅ No errors in logs

---

## 🌍 Your System is Now Live

After deployment:
```
Frontend Dashboard: https://triagent-v2.vercel.app (optional)
Backend API:       https://triagent-api-xyz.railway.app
Public domain:     ✅ HTTPS enabled
Uptime:            24/7 (99.9% SLA)
Auto-scaling:      Enabled
Monitoring:        Built-in
Cost:              ~$6/month
```

---

## 📝 Summary

1. **Push code** to GitHub
2. **Go to Railway.app** → Create project from GitHub
3. **Add env variables** from your .env
4. **Wait for deployment** (5 minutes)
5. **Test API** endpoints
6. **You're live!** 🎉

The rest (HTTPS, scaling, monitoring) is automatic.

---

<div align="center">

**Ready? Deploy now at: https://railway.app**

Questions? Check the logs in Railway dashboard.

</div>

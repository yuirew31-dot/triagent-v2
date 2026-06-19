# ⚡ Render Free Deployment - 15 Minute Quick Start

**Get TriAgent v2 running on Render's free tier NOW!**

---

## 🎯 Overview

You'll deploy 2 things:
1. **Backend** (Node.js API) → Free tier
2. **Frontend** (React dashboard) → Free tier

Total cost: **$0/month** (for 3 months)

---

## ⏱️ Timeline

- **Step 1-2**: GitHub setup (3 min)
- **Step 3-4**: Backend deploy (5 min)
- **Step 5-6**: Frontend deploy (5 min)
- **Step 7**: Connect & test (2 min)

**Total: 15 minutes** ✅

---

## 🔑 Prerequisites (Have Ready)

Before starting, gather these:
- GitHub account (free)
- Render account (create at https://render.com)
- Your API keys from `.env`:
  ```
  FIREWORKS_API_KEY=
  SILICONFLOW_API_KEY=
  GEMINI_API_KEY_1=
  GEMINI_API_KEY_2=
  COHERE_API_KEY=
  GROQ_API_KEY=
  ANTHROPIC_API_KEY=
  ```

---

## 📍 Step 1: Prepare Your Code (2 minutes)

### 1a. Ensure GitHub is set up
```bash
cd d:\Lev\PythonProjects\triagent-v2

# Check if git repo exists
git remote -v

# If nothing shows, create it:
git init
git add .
git commit -m "TriAgent v2 - Ready for Render deployment"
git branch -M main
```

### 1b. Create GitHub repository
1. Go to https://github.com/new
2. Name: `triagent-v2`
3. Select: **Public** ✅
4. Click: **"Create repository"**
5. Copy the repository URL

### 1c. Connect and push
```bash
git remote add origin https://github.com/YOUR_USERNAME/triagent-v2.git
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend to Render (5 minutes)

### 2a. Go to Render

Open: **https://dashboard.render.com**
- Sign up with GitHub
- Grant permissions

### 2b. Create Web Service

1. Click **"+ New"** → **"Web Service"**
2. Click **"Connect"** next to your GitHub repo
3. Find and select: `triagent-v2`
4. Click **"Connect"**

### 2c. Configure the service

Fill in:
```
Name:              triagent-api
Environment:       Node
Region:            Ohio
Branch:            main
Build Command:     cd server && npm install && npm run build
Start Command:     cd server && npm start
Plan:              Free ✅
```

### 2d. Add environment variables

Click **"Advanced"** → Scroll down to **"Environment Variables"**

Add each one (click + after each):
```
FIREWORKS_API_KEY       = your_key_from_dot_env
SILICONFLOW_API_KEY     = your_key_from_dot_env
GEMINI_API_KEY_1        = your_key_from_dot_env
GEMINI_API_KEY_2        = your_key_from_dot_env
COHERE_API_KEY          = your_key_from_dot_env
GROQ_API_KEY            = your_key_from_dot_env
ANTHROPIC_API_KEY       = your_key_from_dot_env
NODE_ENV                = production
PORT                    = 10000
HOST                    = 0.0.0.0
```

### 2e. Deploy!

1. Click **"Create Web Service"**
2. **Wait 5-10 minutes** (see status "Building...")
3. ✅ When done, copy your URL: `https://triagent-api-xxxx.render.com`

### 2f. Test the backend

Wait for green checkmark, then test:
```bash
curl https://triagent-api-xxxx.render.com/health
# Should return: {"status":"ok"}
```

**✅ Backend is live!**

---

## 🎨 Step 3: Deploy Frontend to Render (5 minutes)

### 3a. Build the frontend locally

```bash
cd d:\Lev\PythonProjects\triagent-v2\client
npm install
npm run build
```

This creates a `dist/` folder with static files.

### 3b. Push build to GitHub

```bash
cd d:\Lev\PythonProjects\triagent-v2

# Add the built files
git add .
git commit -m "Build frontend for production"
git push origin main
```

### 3c. Create Static Site on Render

1. Go back to Render dashboard
2. Click **"+ New"** → **"Static Site"**
3. Click **"Connect"** and select: `triagent-v2`
4. Click **"Connect"**

### 3d. Configure the static site

Fill in:
```
Name:               triagent-dashboard
Branch:             main
Build Command:      cd client && npm install && npm run build
Publish Directory:  client/dist
Plan:               Free ✅
```

### 3e. Add environment variable

Click **"Advanced"** → **"Environment Variables"**

Add:
```
VITE_API_URL = https://triagent-api-xxxx.render.com
```
(Use the backend URL from Step 2e!)

### 3f. Deploy!

1. Click **"Create Static Site"**
2. **Wait 2-3 minutes**
3. ✅ When done, copy your URL: `https://triagent-dashboard-xxxx.render.com`

**✅ Frontend is live!**

---

## 🔗 Step 4: Test Everything (2 minutes)

### 4a. Test the frontend
1. Open: `https://triagent-dashboard-xxxx.render.com`
2. You should see the TriAgent interface
3. Click "Create Task" and test sending a query

### 4b. Check the backend logs

1. Go to your Web Service on Render
2. Click **"Logs"** tab
3. You should see incoming requests from your frontend

### 4c. Create a test task

In the dashboard:
1. Enter: `"What is 2+2?"`
2. Click: `"Send"`
3. Should get response from Claude

**✅ Everything works!**

---

## ⚙️ Step 5: Keep Service Alive (Optional but Recommended)

### Problem
Free tier services spin down after 15 min. First request = 30-60s delay.

### Solution
Set up a cron job to ping the service every 10 minutes:

1. Go to your **Web Service** on Render
2. Click **"Cron Jobs"** tab
3. Click **"Add Cron Job"**
4. Fill in:
   ```
   Name:       Keep-Alive
   Frequency:  Every hour
   Command:    curl https://triagent-api-xxxx.render.com/health
   ```
5. Click **"Add"**

**✅ Your service stays warm!**

---

## 📊 Your Live System

### Frontend Dashboard
```
https://triagent-dashboard-xxxx.render.com
```
- See your tasks
- Create new tasks
- Monitor agents

### Backend API
```
https://triagent-api-xxxx.render.com
```
- API endpoint: `/api/tasks`
- Metrics: `/api/metrics`
- Health: `/health`

### Test URL
```bash
curl https://triagent-api-xxxx.render.com/api/metrics
```

---

## 🆓 Cost Summary

| Component | Cost | Notes |
|-----------|------|-------|
| Web Service (Backend) | FREE | 512 MB RAM |
| Static Site (Frontend) | FREE | Unlimited bandwidth |
| **Total** | **$0** | For 3 months |

After 90 days: PostgreSQL becomes paid (~$7/mo)

---

## ❓ Quick Troubleshooting

### "Static site shows blank page"
- Wait 30 seconds for service to wake up
- Refresh browser
- Check browser console (F12) for errors

### "API errors in frontend"
- Make sure `VITE_API_URL` is correct in Static Site settings
- Redeploy the static site
- Check backend logs

### "Backend not responding"
- Wait 60 seconds (free tier spin-up)
- Check Web Service status (should be green)
- Look in Logs tab for errors

### "Build failed"
- Check Logs tab on Render
- Common issue: missing API keys
- Common issue: Node version mismatch

---

## 📝 Useful Commands

### Redeploy after code changes
```bash
git add .
git commit -m "Your changes"
git push origin main
# Render auto-redeploys in 1-2 min!
```

### View logs
- Render dashboard → Your service → Logs tab

### Manual restart
- Render dashboard → Your service → Settings → "Restart"

---

## 🎉 Done!

Your TriAgent is now live on Render's free tier!

### Next Steps:
1. ✅ Test with real queries
2. ✅ Share the URL with others
3. ✅ Monitor usage and costs
4. ✅ Plan upgrade if needed

### Support:
- Full guide: Read `RENDER_DEPLOY.md`
- Render docs: https://render.com/docs
- Having issues? Check the "Troubleshooting" section above

---

**🚀 Congratulations! You're live!** 🎉

# 🚀 FREE WEB DEPLOYMENT GUIDE

Deploy AI Workspace completely free with full features. Choose your platform below.

---

## ⚡ QUICKEST SETUP (5 minutes)

### Option 1: Railway (RECOMMENDED)
Railway offers the best free tier for full-stack apps.

**Free Tier:**
- ✅ 5GB storage
- ✅ Always free tier with generous limits
- ✅ Auto deployments from GitHub
- ✅ Built-in PostgreSQL option
- ✅ Custom domain included

**Steps:**

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/triagent-v2.git
   git push -u origin main
   ```

2. **Create Railway Project**
   - Go to https://railway.app
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - Select your `triagent-v2` repo
   - Click "Deploy"

3. **Add Environment Variables**
   - Go to Project Settings → Variables
   - Add all from your `.env` file:
     ```
     FIREWORKS_API_KEY=fw_...
     SILICONFLOW_API_KEY=sk_...
     GEMINI_API_KEY_1=AQ...
     COHERE_API_KEY=zBAX...
     GROQ_API_KEY=gsk_...
     ANTHROPIC_API_KEY=sk-ant...
     NODE_ENV=production
     CORS_ORIGIN=https://YOUR_RAILWAY_DOMAIN.railway.app
     DB_PATH=/data/triagent.db
     ```

4. **Wait for Deployment** (2-5 minutes)
   - Railway builds and deploys automatically
   - You'll get a domain like: `triagent-v2-production.up.railway.app`

5. **Update Frontend API URL**
   - Edit `.env.production` in your client or set at build time
   - Point to your Railway domain

**Total time: ~5 minutes ⚡**

---

### Option 2: Vercel (Frontend) + Render (Backend)

**Vercel** (Free Frontend)
- ✅ Blazingly fast
- ✅ Auto deploys from GitHub
- ✅ No build time limits
- ✅ Global CDN

**Render** (Free Backend)
- ✅ Free tier: 0.5GB RAM
- ⚠️ Spins down after 15 min of inactivity
- ✅ Auto deploys from GitHub
- ✅ Easy database setup

**Frontend on Vercel:**

1. Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "client/dist",
     "env": {
       "VITE_API_URL": "@vite-api-url"
     },
     "envPrefix": "VITE_"
   }
   ```

2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Set environment:
   - `VITE_API_URL=https://your-render-app.onrender.com`
5. Deploy!

**Backend on Render:**

1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repo
4. Settings:
   ```
   Build Command: npm run build:all
   Start Command: npm run start:prod
   ```
5. Add all environment variables from `.env`
6. Deploy!

**Total time: ~10 minutes**

---

### Option 3: Netlify (Frontend Only) + Railway (Backend)

**Netlify** (Free Frontend)
- ✅ Extremely fast
- ✅ Generous free tier
- ✅ Great for SPAs
- ⚠️ Can't host backend

1. Go to https://app.netlify.com
2. "Add new site" → "Import existing project"
3. Select GitHub repo
4. Settings:
   ```
   Build command: cd client && npm run build
   Publish directory: client/dist
   ```
5. Add environment:
   ```
   VITE_API_URL=https://your-railway-domain.railway.app
   ```

Then deploy backend on Railway (see Option 1)

**Total time: ~10 minutes**

---

## 📱 MOBILE APP SETUP (Samsung S25+)

Your app is now a **Progressive Web App (PWA)**.

### Install as App on Android:

1. **Open in Chrome**
   - Go to your deployment URL
   - Wait 5 seconds

2. **Install**
   - Look for "Install" button (or 3-dot menu)
   - Tap "Install app"
   - Or: Menu → "Install app"

3. **Done!**
   - App appears on home screen
   - Works offline
   - Full screen, no browser UI
   - Appears in app drawer
   - Can pin to home screen

### Features Available:
- ✅ Offline support
- ✅ Push notifications ready
- ✅ File sharing integration
- ✅ Home screen shortcut
- ✅ Persistent storage

---

## 🔐 SECURITY & PRODUCTION

### Before Going Live:

1. **Change encryption secret:**
   ```bash
   # Generate new random secret (32 chars)
   openssl rand -hex 16
   ```
   Set `ENCRYPTION_SECRET` to this value

2. **Disable development mode:**
   ```
   NODE_ENV=production
   ```

3. **Set proper CORS:**
   ```
   CORS_ORIGIN=https://your-domain.com
   ```

4. **Backup your database:**
   - Railway: Auto backups
   - Render: Add PostgreSQL add-on
   - Vercel: Store data in external DB

---

## 🌐 CUSTOM DOMAIN (Optional, Free)

### Railway:
1. Project Settings → Domains
2. Click "Add Custom Domain"
3. Add `CNAME` record to your DNS
4. Wait for verification (~5 min)

### Vercel:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records
4. Auto HTTPS (free with Let's Encrypt)

### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Netlify manages SSL (free)

---

## 💰 COST BREAKDOWN (Monthly)

### All Free:
```
Railway: FREE (up to $5/month)
Vercel: FREE (for static site)
Render: FREE (web service)
Netlify: FREE
API Costs: $0 (using free tier keys)
─────────────────────────────
Total: $0
```

### With Premium Features:
```
Railway: $5-10 (for higher limits)
Vercel: $0 (frontendonly)
Render: $7 (upgraded database)
─────────────────────────────
Total: ~$5-20/month
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Code committed to GitHub
- [ ] `.env` variables set in platform
- [ ] Deployment platform selected (Railway recommended)
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Domains connected
- [ ] CORS configured correctly
- [ ] API keys all set
- [ ] Database initialized
- [ ] Tested in browser
- [ ] Tested on mobile (install as app)
- [ ] Offline mode tested

---

## 🆘 TROUBLESHOOTING

### "Connection refused"
- Backend may not be running
- Check deployment logs
- Verify API URL in frontend

### "CORS error"
- Update `CORS_ORIGIN` to match your frontend domain
- Restart backend

### "App crashes on mobile"
- Check browser console
- Verify API connection
- Clear cache and reinstall

### "Database errors"
- Check `DB_PATH` is writable
- Ensure folder exists
- Check permissions

---

## 📊 PERFORMANCE TIPS

1. **Compress responses:** Already in code ✅
2. **Cache aggressively:** Service worker handles it ✅
3. **Use CDN:** Vercel/Railway do this ✅
4. **Minimize API calls:** Smart orchestrator does this ✅

---

## 🔄 CI/CD AUTO UPDATES

All platforms auto-deploy on git push:

```bash
git add .
git commit -m "Feature: improve UI"
git push
# → Auto deployed to your domain!
```

---

## 🎉 YOU'RE DONE!

Your AI Workspace is now live and accessible from anywhere. Share the link and start using it!

**URL:** `https://your-domain.railway.app` (or your chosen platform)

**Mobile:** Open in Chrome → Install → Ready to go!

---

**Questions?** Check logs in your platform's dashboard.
**Issues?** Most are solved by rebuilding and redeploying.

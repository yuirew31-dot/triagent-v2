# 🚀 FASTEST 5-MINUTE DEPLOYMENT TO RAILWAY

## What You'll Get:
✅ Free web app running live  
✅ Mobile app for Samsung S25+  
✅ No credit card needed  
✅ Always-free tier  
✅ Custom domain (optional)  

---

## STEP-BY-STEP

### 1️⃣ Prepare GitHub
```bash
# If not already on GitHub, do this:
git init
git add .
git commit -m "AI Workspace v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/triagent-v2
git push -u origin main
```

### 2️⃣ Create Railway Account
- Go to: **https://railway.app**
- Click "Get Started"
- Sign up with GitHub (easiest)
- Authorize Railway to access your repos

### 3️⃣ Deploy Project
- Click "Create New Project"
- Select "Deploy from GitHub repo"
- Search for `triagent-v2`
- Click to select it
- Railway will auto-detect and start building! ⚡

### 4️⃣ Add Environment Variables
While it's building:
1. Click on "Variables" tab
2. Add all these from your `.env` file:

```env
FIREWORKS_API_KEY=your_key_here
SILICONFLOW_API_KEY=your_key_here
GEMINI_API_KEY_1=your_key_here
GEMINI_API_KEY_2=your_key_here
COHERE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
NODE_ENV=production
```

### 5️⃣ Wait for Build
- Railway builds automatically (~3-5 min)
- Shows a URL like: `triagent-v2-production.up.railway.app`
- Copy this URL! ✨

### 6️⃣ Test
1. Open the URL in your browser
2. Should see: "AI Workspace" with white interface
3. Try creating a new chat
4. Make sure API calls work

### 7️⃣ Install on Mobile (Android S25+)
1. Open the app URL on your phone in **Chrome**
2. Wait 5 seconds
3. See "Install" button (or click 3-dot menu → "Install app")
4. Tap "Install"
5. Done! ✅ App is on home screen like any other app

---

## 📱 MOBILE APP FEATURES

Once installed, your app has:
- ✅ Works offline
- ✅ No browser UI (fullscreen)
- ✅ Appears in app drawer
- ✅ Push to home screen
- ✅ Instant launch
- ✅ Real-time sync when online

---

## 🔗 CONNECT YOUR DOMAIN (Optional)

If you own a domain (e.g., `myai.com`):

1. Go to Railway → Project Settings → Domains
2. Click "+ Add Domain"
3. Enter your domain: `myai.com`
4. Railway gives you CNAME records to add
5. Add them to your DNS provider (GoDaddy, Namecheap, etc.)
6. Wait 5-10 minutes
7. Access at: `https://myai.com` 🎉

---

## 💡 TIPS

**Share your app:**
```
Check out my AI: https://triagent-v2-production.up.railway.app
```

**Offline mode:**
- Already built-in (service worker)
- Service worker caches everything
- Messages available offline

**Update code:**
```bash
git add .
git commit -m "Update feature"
git push
# → Auto deployed! No need to touch Railway
```

**Monitor performance:**
- Railway dashboard shows logs
- Check "Logs" tab if something breaks
- Usually just need to restart

---

## ⚠️ TROUBLESHOOTING

**"Build failed"**
- Check logs in Railway
- Usually missing dependency
- Try: `npm install` locally first

**"Connection error"**
- API keys might be wrong
- Try one key at a time
- Check which service is failing

**"App won't load"**
- Clear browser cache
- Restart Railway service
- Check if domain is correct

**"Mobile app crashed"**
- Clear app cache
- Reinstall
- Check browser console for errors

---

## 🎉 YOU'RE LIVE!

Your AI Workspace is now:
- 🌐 Live on the web
- 📱 Installed on your phone
- 🚀 Ready for friends & family to use
- 💰 Completely FREE

**Next:** Share the link! Get feedback! Improve!

---

**Questions?** Railways docs: https://docs.railway.app

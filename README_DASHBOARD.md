# TriAgent v2 - Multi-Agent AI System Dashboard

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **A production-ready dashboard for monitoring and managing multi-agent AI systems with real-time metrics, cost tracking, and intelligent task routing.**

## 🌟 Features

### 🎯 **Real-time Monitoring**
- Live task execution tracking
- Agent workload distribution
- Real-time metrics updates (every 5 seconds)
- Cost tracking dashboard

### 🤖 **Intelligent Agent Routing**
- Frontend tasks → GLM-5.2 (Web Development Expert)
- Backend tasks → Kimi K2.7 (Architecture Expert)
- Math tasks → Gemini 3.5 Flash (FREE Math Expert)
- Mixed tasks → Claude 3.5 Sonnet (General Purpose)

### 💰 **Cost Optimization**
- Real-time cost calculation
- Per-agent cost tracking
- Smart caching (30-min TTL)
- Compression engine (98% token reduction)

### 📊 **Beautiful UI**
- Modern gradient design
- Responsive layout (mobile-friendly)
- Dark/light theme support
- Real-time charts and metrics

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended - 2 minutes)
```bash
# 1. Push to GitHub
git add . && git commit -m "Add Dashboard" && git push

# 2. Visit Vercel
https://vercel.com/new

# 3. Select this repo and click Deploy
# 4. Add environment variable: NEXT_PUBLIC_API_URL
# 5. Done! ✨
```

### Option 2: Run Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### Option 3: Docker
```bash
docker build -t triagent-dashboard .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-backend:3000 \
  triagent-dashboard
```

## 📋 Environment Variables

```env
# Required: Your TriAgent backend URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Or production backend
NEXT_PUBLIC_API_URL=https://your-triagent-api.railway.app
```

## 🎨 Screenshot

```
┌─────────────────────────────────────────────────┐
│   🤖 TriAgent v2 Dashboard                      │
│   Multi-Agent AI System - Real-time Monitoring  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Tasks  💰 Cost  ⚡ Response  📈 Tokens      │
│   25       $0.000150  234ms     1,250          │
│                                                 │
│  ✨ Create New Task                             │
│  ┌────────────────────────────────────────────┐│
│  │ Enter your prompt...                       ││
│  │                                            ││
│  │ [Submit Task] [Clear]                      ││
│  └────────────────────────────────────────────┘│
│                                                 │
│  🤖 Agent Usage          📋 Task History       │
│  GLM    25 tasks         [Task 1] Frontend     │
│  Kimi   15 tasks         [Task 2] Backend      │
│  Gemini 10 tasks         [Task 3] Math         │
│  Claude  5 tasks         [Task 4] Mixed        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📦 Deployment Options

### Frontend Hosting (Dashboard)
| Platform | Cost | Setup Time |
|----------|------|-----------|
| **Vercel** | $0 | 2 min ✨ |
| **Netlify** | $0 | 3 min |
| **GitHub Pages** | $0 | 5 min |

### Backend Hosting (API Server)
| Platform | Cost | Setup Time |
|----------|------|-----------|
| **Railway** | $5/month | 5 min ⭐ |
| **Render** | $0 (limited) | 5 min |
| **Heroku** | ~$5-7/month | 5 min |
| **Local + ngrok** | $0 | 2 min |

## 🔌 API Integration

### Connect to Your Backend
```javascript
// Automatically connects to configured API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Endpoints used:
GET  /api/tasks           // Get all tasks
POST /api/tasks           // Create new task
GET  /api/metrics         // Get metrics
GET  /api/health          // Health check
```

## 📊 Real-time Metrics

```json
{
  "totalMetrics": 25,
  "summary": {
    "totalCost": 0.00015,
    "totalTokens": 1250,
    "avgExecutionTimeMs": 234,
    "cacheHitRate": "35%"
  },
  "recentMetrics": [
    {
      "agent": "glm",
      "tokensUsed": 150,
      "estimatedCost": 0.000022,
      "executionTimeMs": 450,
      "cacheHit": false
    }
  ]
}
```

## 🛠️ Development

### File Structure
```
.
├── pages/
│   └── index.jsx          # Main dashboard
├── styles/
│   └── dashboard.css      # Styling
├── pages/api/             # Next.js API routes
├── next.config.js         # Vercel configuration
├── package.json           # Dependencies
└── DEPLOYMENT_VERCEL.md   # Detailed guide
```

### Customize Dashboard

Edit `pages/index.jsx`:
```javascript
// Change refresh interval
const REFRESH_INTERVAL = 5000; // milliseconds

// Add new metric cards
<Card title="Custom Metric" value={data.metric} />

// Modify styling in styles/dashboard.css
```

## 🔒 Security

- ✅ API keys stored in backend `.env` (never exposed)
- ✅ CORS properly configured
- ✅ Environment variables in Vercel dashboard
- ✅ No sensitive data in frontend code
- ✅ HTTPS/SSL automatic

## 📈 Performance

- ⚡ **Load time**: < 2 seconds
- 🚀 **Refresh rate**: 5 seconds
- 💾 **Bundle size**: ~50KB gzipped
- 🌍 **CDN**: Global (via Vercel)
- 📱 **Responsive**: Mobile-first design

## 🐛 Troubleshooting

### Dashboard shows "Cannot connect to backend"
```
1. Check NEXT_PUBLIC_API_URL is correct
2. Verify backend is running
3. Check CORS in backend server/index.ts
4. Look at browser DevTools → Network tab
```

### Metrics not updating
```
1. Verify API endpoint returns JSON
2. Check browser console for errors
3. Disable ad blocker
4. Clear browser cache (Ctrl+Shift+Del)
```

### Build fails on Vercel
```
1. Check Node.js version: 18+ required
2. Verify package.json exists
3. Check build logs in Vercel dashboard
4. Ensure all imports are correct
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_VERCEL.md) - Step-by-step deploy instructions
- [API Reference](API_QUICK_REFERENCE.md) - API endpoint documentation
- [Production Guide](PRODUCTION_GUIDE.md) - Architecture and best practices
- [Testing Guide](EXAMPLES_AND_TESTING.md) - Integration tests and examples

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 💬 Support

- 📖 Read the [documentation](DEPLOYMENT_VERCEL.md)
- 🐛 Open an [issue](https://github.com/your-repo/issues)
- 💭 Start a [discussion](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) - The React Framework
- Hosted on [Vercel](https://vercel.com) - Frontend cloud platform
- Multi-agent system powered by Claude, GLM, Kimi, Gemini, and Groq

---

<div align="center">

**[🚀 Deploy Now](https://vercel.com/new)** • **[📖 Read Guide](DEPLOYMENT_VERCEL.md)** • **[💡 See Examples](EXAMPLES_AND_TESTING.md)**

Made with ❤️ for the AI community

</div>

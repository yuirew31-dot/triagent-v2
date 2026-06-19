#!/bin/bash

# ===============================================
# DEPLOYMENT SCRIPT FOR FREE WEB HOSTING
# Supports: Vercel, Railway, Netlify
# ===============================================

echo "🚀 AI Workspace - FREE WEB DEPLOYMENT"
echo "========================================"
echo ""
echo "Choose your deployment platform:"
echo "1) Vercel (recommended - fastest, free tier)"
echo "2) Railway (good - free tier with generous limits)"
echo "3) Netlify (frontend only - limited)"
echo ""
echo "NOTE: Backend needs to stay somewhere. Options:"
echo "- Railway (free tier: 5GB/month)"
echo "- Render.com (free tier: 0.5GB RAM)"
echo "- Fly.io (generous free tier)"
echo ""
read -p "Choose (1-3): " choice

case $choice in
  1)
    echo "📦 Setting up VERCEL deployment..."
    echo ""
    echo "Steps:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Login: vercel login"
    echo "3. Deploy frontend:"
    echo "   cd client && vercel deploy --prod"
    echo "4. Deploy backend separately on Railway/Render"
    echo ""
    echo "FRONTEND VERCEL CONFIG:"
    cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "env": {
    "VITE_API_URL": "@vite-api-url"
  }
}
EOF
    echo "✅ vercel.json created"
    ;;
  2)
    echo "📦 Setting up RAILWAY deployment..."
    echo ""
    echo "Steps:"
    echo "1. Go to https://railway.app"
    echo "2. Connect GitHub repo"
    echo "3. Select this directory"
    echo "4. Set environment variables from .env"
    echo "5. Deploy!"
    echo ""
    echo "RAILWAY CONFIG:"
    cat > railway.toml << 'EOF'
[build]
builder = "nixpacks"
cmd = "npm install && npm run build:all"

[deploy]
startCommand = "npm run start:prod"
restartPolicyMaxRetries = 5
EOF
    echo "✅ railway.toml created"
    ;;
  3)
    echo "📦 Setting up NETLIFY deployment..."
    echo "⚠️  Note: Netlify is frontend only, need separate backend"
    echo ""
    echo "Steps:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Connect GitHub repo"
    echo "3. Build command: cd client && npm run build"
    echo "4. Publish directory: client/dist"
    echo ""
    ;;
esac

echo ""
echo "Next: Choose backend hosting..."

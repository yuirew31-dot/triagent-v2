#!/bin/bash
# TriAgent v2 Quick Start - Deploy Dashboard in 5 Minutes

echo "🚀 TriAgent v2 Dashboard - Quick Deploy"
echo "======================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# Step 1: Install Next.js dependencies
echo ""
echo "📦 Step 1: Installing dependencies..."
npm install next@latest react@latest react-dom@latest

# Step 2: Create pages directory
echo "📁 Step 2: Creating directory structure..."
mkdir -p pages
mkdir -p styles

# Step 3: Copy configuration files
echo "📋 Step 3: Setting up configuration..."
cp dashboard-package.json package.json

# Step 4: Test local build
echo ""
echo "🔨 Step 4: Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "📍 Next steps:"
    echo "   1. Push to GitHub: git add . && git commit -m 'Add Dashboard' && git push"
    echo "   2. Go to: https://vercel.com/new"
    echo "   3. Import your repo and click Deploy"
    echo "   4. Add NEXT_PUBLIC_API_URL env var in Vercel Settings"
    echo "   5. Done! Your dashboard is live 🎉"
    echo ""
    echo "🌐 To test locally: npm run dev"
    echo "   Then visit: http://localhost:3000"
else
    echo "❌ Build failed. Check error messages above."
    exit 1
fi

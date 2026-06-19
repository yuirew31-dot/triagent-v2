# 🚀 Build APK Script for TriAgent v2 (Personal Use)
# For Samsung S25+, without Play Store submission

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🚀 TriAgent v2 - Android APK Builder" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green

# Check if npm modules installed
Write-Host ""
Write-Host "✓ Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

# Build client
Write-Host ""
Write-Host "✓ Building frontend (Vite)..." -ForegroundColor Yellow
npm run client:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# Check if Android platform exists
Write-Host ""
Write-Host "✓ Checking Android platform..." -ForegroundColor Yellow
if (Test-Path "android") {
    Write-Host "  Android platform exists, syncing..." -ForegroundColor Green
    npx cap sync android
} else {
    Write-Host "  Adding Android platform..." -ForegroundColor Yellow
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to add Android platform" -ForegroundColor Red
        Write-Host "Make sure Android SDK and Java are installed:" -ForegroundColor Yellow
        Write-Host "  1. Install Android Studio: https://developer.android.com/studio" -ForegroundColor Yellow
        Write-Host "  2. Install Java JDK 17+: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "================================================"
Write-Host "APK Build Setup Complete!"
Write-Host "================================================"
Write-Host ""
Write-Host "Next steps:"
Write-Host ""
Write-Host "  Option 1 - Build Debug APK (RECOMMENDED):"
Write-Host "    cd android"
Write-Host "    ./gradlew assembleDebug"
Write-Host ""
Write-Host "  Option 2 - Use Android Studio GUI:"
Write-Host "    npx cap open android"
Write-Host "    Then: Build > Build Bundle(s)/APK(s) > Build APK(s)"
Write-Host ""
Write-Host "APK Output Location:"
Write-Host "    android/app/build/outputs/apk/debug/app-debug.apk"
Write-Host ""
Write-Host "Installation on Samsung S25+:"
Write-Host "    1. Copy APK to phone via USB or email"
Write-Host "    2. Open file manager on phone"
Write-Host "    3. Tap the APK file"
Write-Host "    4. Tap Install"
Write-Host "    5. Allow Unknown sources if prompted"
Write-Host ""

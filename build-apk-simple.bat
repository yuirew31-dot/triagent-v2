@echo off
REM TriAgent APK Builder - Requires Java 11, 17, or 21
REM ================================================

setlocal enabledelayedexpansion

echo ================================================
echo.TriAgent v2 - Android APK Builder
echo ================================================
echo.

REM Check Java version
echo Checking Java installation...
for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION=%%i
    echo Java version: !JAVA_VERSION!
)

REM Extract major version
for /f "tokens=1 delims=." %%i in ("%JAVA_VERSION%") do set JAVA_MAJOR=%%i

REM Check if Java version is compatible (11, 17, 21)
if "!JAVA_MAJOR!"=="11" (
    echo ✓ Java 11 - Compatible
) else if "!JAVA_MAJOR!"=="17" (
    echo ✓ Java 17 - Compatible
) else if "!JAVA_MAJOR!"=="21" (
    echo ✓ Java 21 - Compatible
) else if "!JAVA_MAJOR!"=="26" (
    echo ✗ Java 26 - NOT compatible with Gradle
    echo.
    echo To fix this, install Java 17:
    echo   Option 1: Windows Package Manager
    echo     winget install EclipseAdoptium.Temurin.17.JDK
    echo.
    echo   Option 2: Download manually
    echo     https://adoptium.net/temurin/releases/?version=17
    echo.
    echo   Option 3: Use WSL with Linux Java
    echo     wsl apt install openjdk-17-jdk
    echo.
    pause
    exit /b 1
) else (
    echo ✗ Java %JAVA_MAJOR% - Version not supported
    echo Please install Java 17: https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)

REM Check Node.js
echo Checking Node.js...
node -v
npm -v

REM Build frontend
echo.
echo Building frontend with Vite...
call npm run client:build
if errorlevel 1 (
    echo ✗ Frontend build failed
    pause
    exit /b 1
)
echo ✓ Frontend built successfully

REM Build APK
echo.
echo Building Android APK...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo ✗ APK build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ APK built successfully

REM Find APK
set APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk
if exist "%APK_PATH%" (
    echo.
    echo ================================================
    echo.✓ SUCCESS!
    echo.APK file created: %APK_PATH%
    echo.Size: 
    for %%i in ("%APK_PATH%") do echo    %%~zi bytes
    echo.
    echo Installation instructions:
    echo   1. Connect Samsung S25+ via USB
    echo   2. Enable USB Debugging on phone
    echo   3. Copy APK file to phone or use:
    echo      adb install "%APK_PATH%"
    echo   4. Tap the APK file on phone to install
    echo.
    echo ================================================
    pause
) else (
    echo ✗ APK not found at %APK_PATH%
    pause
    exit /b 1
)

endlocal

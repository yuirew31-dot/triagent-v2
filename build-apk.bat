@echo off
REM APK Builder для TriAgent v2 (Personal Use)

echo.
echo ================================================
echo TriAgent v2 - Android APK Builder
echo ================================================
echo.

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-26.0.1
set Path=%Path%;%JAVA_HOME%\bin

echo Checking Java...
java -version
if errorlevel 1 (
    echo ERROR: Java not found!
    pause
    exit /b 1
)

echo.
echo Checking Android SDK...
if not defined ANDROID_HOME (
    echo WARNING: ANDROID_HOME not set
    echo Please install Android Studio first:
    echo https://developer.android.com/studio
    echo.
    echo After install, set ANDROID_HOME to:
    echo C:\Users\YourName\AppData\Local\Android\Sdk
    pause
    exit /b 1
)

echo Android SDK: %ANDROID_HOME%

echo.
echo Building Debug APK...
cd android
call gradlew.bat assembleDebug

if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo BUILD SUCCESSFUL!
echo ================================================
echo.
echo APK Location:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Copy to phone and tap to install
echo.
pause

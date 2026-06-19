# 📱 Build APK for Samsung S25+ (Personal Use)

## ✅ Prerequisites (Установка один раз)

### 1️⃣ Install Java JDK 17+

**Option A: Chocolatey (если установлен)**
```powershell
choco install openjdk
```

**Option B: Manual Download**
- Скачайте JDK 17: https://www.oracle.com/java/technologies/downloads/#java17
- Установите (next, next, finish)
- Проверьте:
```powershell
java -version
```

### 2️⃣ Install Android SDK

**Easiest Way: Android Studio**
1. Скачайте: https://developer.android.com/studio
2. Установите (next, next, finish)
3. Откройте Android Studio
4. Меню: Tools → SDK Manager
5. Установите:
   - Android SDK (latest)
   - Android SDK Build-tools (latest)
   - Android Emulator (опционально)

**Проверьте установку:**
```powershell
$env:ANDROID_HOME
```

Должно вывести путь вроде: `C:\Users\YourName\AppData\Local\Android\Sdk`

Если пусто, установите переменную окружения (Windows Settings → Environment Variables):
```
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
```

### 3️⃣ Verify Installation

```powershell
# Проверить Java
java -version

# Проверить Android SDK
adb version

# Проверить Gradle
gradle -v
```

Все должны вывести версии (не ошибки).

---

## 🚀 Build APK (После установки Java + Android SDK)

### Step 1: Добавить Android платформу

```bash
cd d:\Lev\PythonProjects\triagent-v2

# Добавить Android (один раз)
npx cap add android

# Или синхронизировать, если уже есть
npx cap sync android
```

### Step 2: Build Debug APK

**Option A: Command Line (FAST)**
```powershell
cd android
./gradlew assembleDebug
```

Ждите **5-10 минут**. Когда завершится, увидите:
```
BUILD SUCCESSFUL
```

**Option B: Android Studio GUI**
```powershell
npx cap open android
```
Затем в Android Studio:
- Меню: Build → Build Bundle(s)/APK(s) → Build APK(s)
- Ждите завершения

---

## 📂 Locate APK File

После успешной сборки APK находится здесь:
```
d:\Lev\PythonProjects\triagent-v2\android\app\build\outputs\apk\debug\app-debug.apk
```

Размер: ~50-80 MB

---

## 📱 Install on Samsung S25+

### Via USB Cable (RECOMMENDED)

1. **Connect phone to PC** with USB cable
2. **Enable USB Debugging** on phone:
   - Settings → Developer Options → USB Debugging (ON)
3. **Copy APK to phone:**
   ```powershell
   # Option 1: Direct ADB install
   cd android
   adb install app\build\outputs\apk\debug\app-debug.apk
   ```
   
   **OR**
   
   ```powershell
   # Option 2: Manual copy
   # 1. Open File Manager on PC
   # 2. Navigate to: android/app/build/outputs/apk/debug/
   # 3. Right-click app-debug.apk
   # 4. Send to Phone (Windows)
   # OR
   # 5. Copy to phone's Downloads folder via USB
   ```

4. **On phone:**
   - Open File Manager
   - Go to Downloads folder
   - Tap `app-debug.apk`
   - Tap "Install"
   - Allow "Unknown sources" if prompted
   - Wait for install (10-30 seconds)

5. **Done! ✅**
   - App appears in app drawer
   - Launch anytime

### Via Email/AirDrop

1. Attach `app-debug.apk` to email
2. Send to yourself or friend
3. Open email on phone
4. Download APK
5. Tap to install
6. Follow same steps as above

### Via Google Drive/OneDrive

1. Upload APK to cloud storage
2. Open on phone
3. Download APK
4. Tap to install

---

## 🔧 Troubleshooting

### "Java not found"
```powershell
# Install from command line:
choco install openjdk

# Or manual: https://www.oracle.com/java/technologies/downloads/
```

### "Android SDK not found"
```powershell
# Install Android Studio:
# https://developer.android.com/studio

# After install, set environment:
$env:ANDROID_HOME = "C:\Users\<YourName>\AppData\Local\Android\Sdk"
```

### "Gradle build failed"
```powershell
# Clear cache and retry:
cd android
./gradlew clean
./gradlew assembleDebug
```

### APK install fails on phone
- Check: Settings → Apps → Unknown sources (ALLOW)
- Or try: Settings → Security → Install unknown apps (allow file manager)
- Some Samsung phones need: Settings → Biometrics and security → Install unknown apps

### App crashes after install
- Check: Android version (need 6.0+)
- Try reinstalling
- Check phone storage (need 100MB+ free)

---

## 📊 What You Get

✅ Full-featured AI app
✅ Works offline (local storage)
✅ No internet connection needed (except for API calls)
✅ Can run backend on phone later
✅ No Play Store submission needed
✅ Can share APK with anyone

---

## 🎯 Next Steps (Optional)

### Run Backend on Phone
- Use Termux + Node.js
- Run server on phone, use as sever
- Access from other devices

### Distribute to Friends
- Just share APK file
- They tap → Install
- Done!

### Update APK
- Rebuild: `npm run client:build`
- Share new APK
- Install updates same way

---

## ⏱️ Typical Timeline

- Install Java + Android SDK: **30-60 min** (one time)
- Build APK: **5-10 min**
- Install on phone: **2 min**
- **Total first time: 40-80 min**
- **Next builds: 5-10 min**

---

## Need Help?

If any step fails, open a terminal and share the error:
```powershell
cd d:\Lev\PythonProjects\triagent-v2\android
./gradlew assembleDebug --stacktrace
```

// Placeholder for Capacitor app configuration
export const config = {
  appId: 'com.triagent.app',
  appName: 'TriAgent v2',
  webDir: '../server/public',
  server: {
    androidScheme: 'https',
    url: 'http://localhost:5173',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

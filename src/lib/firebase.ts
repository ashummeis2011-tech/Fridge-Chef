// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { config } from 'dotenv';

// Ensure environment variables are loaded
config();

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function initializeFirebase(): FirebaseApp | null {
  // During the build process on the server, if the env vars are not set,
  // we don't want to fail the build. The app will still work on the client
  // where the env vars are available.
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env file.");
    return null;
  }
  
  if (typeof window === 'undefined') {
    // On the server, we need to create a new app instance for each request
    // to avoid sharing state between requests. We can use a random name.
    const appName = `server-${Date.now()}-${Math.random()}`;
    if (!getApps().some(app => app.name === appName)) {
        return initializeApp(firebaseConfig, appName);
    }
    return getApp(appName);
  }
  
  // On the client, we want to use a singleton instance
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

export { initializeFirebase };

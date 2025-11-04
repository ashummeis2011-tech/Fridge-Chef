// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { config } from 'dotenv';

// Load environment variables from .env file, especially for server-side environments.
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

// This function can be called on both client and server.
function initializeFirebase(): FirebaseApp | null {
  // On the server, we need to ensure config is loaded via dotenv, but don't initialize.
  // The actual initialization should only happen on the client.
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Check if essential config values are present on the client.
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Firebase config is missing or incomplete. Check your environment variables are set correctly in your Vercel project settings.");
    return null;
  }

  // Initialize on the client, but only if it hasn't been initialized already.
  // This is a singleton pattern to prevent re-initialization.
  if (!getApps().length) {
    try {
        return initializeApp(firebaseConfig);
    } catch(e) {
        console.error("Failed to initialize Firebase", e);
        return null;
    }
  }
  return getApp();
}

export { initializeFirebase };

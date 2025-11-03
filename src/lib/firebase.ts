// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// This function should only be called on the client side.
function initializeFirebase(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    // On the server, we don't initialize.
    return null;
  }
  
  // Check if all required config values are present.
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Firebase config is missing or incomplete. Check your .env file.");
    return null;
  }

  // Initialize on the client, using a singleton pattern.
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

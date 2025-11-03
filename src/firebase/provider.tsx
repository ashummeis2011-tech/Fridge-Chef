// src/firebase/provider.tsx
'use client';
import { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/lib/firebase';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Use a memoized value that will only be computed once on the client.
  const firebaseServices = useMemo(() => {
    // This function now correctly handles the server-side case by returning null
    const app = initializeFirebase();
    
    if (!app) {
      return { app: null, auth: null, firestore: null };
    }
    
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseServices}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

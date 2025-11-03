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
  const { app, auth, firestore } = useMemo(() => {
    const firebaseApp = initializeFirebase();
    if (!firebaseApp) {
      return { app: null, auth: null, firestore: null };
    }
    const authInstance = getAuth(firebaseApp);
    const firestoreInstance = getFirestore(firebaseApp);
    return { app: firebaseApp, auth: authInstance, firestore: firestoreInstance };
  }, []);

  const contextValue = useMemo(() => {
      return { app, auth, firestore };
  }, [app, auth, firestore]);

  return (
    <FirebaseContext.Provider value={contextValue}>
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

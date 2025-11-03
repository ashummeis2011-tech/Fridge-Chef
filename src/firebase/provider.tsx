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
  const firebaseApp = useMemo(() => initializeFirebase(), []);
  
  const contextValue = useMemo(() => {
    if (!firebaseApp) {
      return { app: null, auth: null, firestore: null };
    }
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    return { app: firebaseApp, auth, firestore };
  }, [firebaseApp]);

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
  // During build or if keys are missing, these can be null.
  // Components should handle this gracefully.
  if (context.app === null) {
      // Return a non-null object with null fields to prevent destructuring errors
      return { app: null, auth: null, firestore: null };
  }
  return context as { app: FirebaseApp, auth: Auth, firestore: Firestore };
}

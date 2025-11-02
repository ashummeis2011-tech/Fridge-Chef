// src/app/login/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc, setDoc, getDoc } from 'firebase/firestore';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not, create a new entry
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }
      
      router.push('/');
      toast({
        title: 'Login Successful',
        description: "You've been successfully logged in.",
      });
    } catch (error) {
      console.error("Google login failed", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'There was a problem logging in with Google. Please try again.',
      });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <ChefHat className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Select a provider below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
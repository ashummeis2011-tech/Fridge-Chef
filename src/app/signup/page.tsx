// src/app/signup/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc, setDoc } from 'firebase/firestore';


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user profile in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });

      router.push('/');
       toast({
        title: 'Account Created!',
        description: "You've successfully signed up.",
      });
    } catch (error) {
       console.error("Google sign up failed", error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'There was a problem signing up with Google. Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <ChefHat className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Choose a provider to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// src/app/signup/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  const handleGoogleSignUp = async () => {
    if (!auth || !firestore) {
        toast({ variant: 'destructive', title: 'Firebase not configured' });
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Redirect immediately for a better user experience
      router.push('/dashboard');
      toast({
        title: 'Account Created!',
        description: "Welcome to FridgeChef!",
      });
      
      // Perform database write in the background
      setDoc(doc(firestore, 'users', user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        age: null,
        bio: '',
      });

    } catch (error) {
      console.error('Google sign up failed', error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'There was a problem signing up with Google. Please try again.',
      });
    }
  };

  const handleEmailSignUp = async (values: z.infer<typeof formSchema>) => {
    if (!auth || !firestore) {
        toast({ variant: 'destructive', title: 'Firebase not configured' });
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Redirect immediately for a better user experience
      router.push('/dashboard');
      toast({
        title: 'Account Created!',
        description: "You've successfully signed up.",
      });

      // Perform profile and database updates in the background
      updateProfile(user, {
        displayName: values.displayName
      });

      setDoc(doc(firestore, "users", user.uid), {
        displayName: values.displayName,
        email: user.email,
        photoURL: '', // No photo URL for email sign-up
        createdAt: serverTimestamp(),
        age: null,
        bio: '',
      });
      
    } catch (error: any) {
       console.error("Email sign up failed", error);
       let description = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            description = 'This email is already in use. Please log in or try a different email address.';
        }
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description,
      });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto">
            <ChefHat className="mx-auto h-12 w-12 text-primary" />
          </Link>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create an account'}
              </Button>
            </form>
          </Form>
          <Separator className="my-4" />
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

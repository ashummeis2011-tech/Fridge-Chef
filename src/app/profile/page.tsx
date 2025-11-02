// src/app/profile/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase/provider';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, User } from 'lucide-react';

const formSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50, { message: 'Name cannot be longer than 50 characters.' }),
  age: z.coerce.number().min(0, { message: 'Age must be a positive number.' }).optional().or(z.literal('')),
  bio: z.string().max(160, { message: 'Bio cannot be longer than 160 characters.' }).optional(),
});

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      age: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
        if (!user) return;
        const userRef = doc(firestore, 'users', user.uid);
        try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                form.reset({
                    displayName: userData.displayName || user.displayName || '',
                    age: userData.age || '',
                    bio: userData.bio || '',
                });
            } else {
                 form.reset({
                    displayName: user.displayName || '',
                    age: '',
                    bio: '',
                });
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your profile data."
            })
        }
    };

    fetchUserData();
  }, [user, loading, router, form, firestore, toast]);
  
  const handleUpdateProfile = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Not Authenticated',
            description: 'You must be logged in to update your profile.',
        });
        return;
    }
    
    try {
        const updateData: any = {
            displayName: values.displayName,
            age: values.age ? Number(values.age) : null,
            bio: values.bio,
        };

        // Update Firebase Auth profile if display name changed
        if (user.displayName !== values.displayName) {
            await updateProfile(user, {
                displayName: values.displayName,
            });
        }

        // Update Firestore document
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, updateData);

        toast({
            title: 'Profile Updated',
            description: 'Your profile has been successfully updated.',
        });
         // This will force a re-render in the layout to show the new name
        router.refresh();
        form.reset(values, { keepValues: true }); // To update the form's dirty state and keep new values
    } catch (error) {
        console.error('Error updating profile:', error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'An error occurred while updating your profile. Please try again.',
        });
    }
  };
  
  if (loading || !user || !form.formState.isDirty && form.getValues().displayName === '') {
    return (
        <div className="p-4 md:p-8 max-w-lg mx-auto animate-in fade-in">
            <header className="flex items-center justify-between gap-3 mb-8">
                 <div className="flex items-center gap-3">
                    <User className="text-primary h-8 w-8" />
                    <h1 className="text-2xl font-bold font-headline text-foreground">
                        User Profile
                    </h1>
                </div>
                 <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </header>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-10 w-24 ml-auto" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto animate-in fade-in-50">
        <header className="flex items-center justify-between gap-3 mb-8">
             <div className="flex items-center gap-3">
                <User className="text-primary h-8 w-8" />
                <h1 className="text-2xl font-bold font-headline text-foreground">
                    User Profile
                </h1>
            </div>
             <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Update your profile information here.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Your Age" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us a little about yourself" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="space-y-2">
                            <FormLabel>Email Address</FormLabel>
                            <Input value={user.email || 'No email associated'} disabled />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}

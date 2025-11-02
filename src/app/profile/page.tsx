// src/app/profile/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase/provider';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { User, ChefHat } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50, { message: 'Name cannot be longer than 50 characters.' }),
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
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      form.setValue('displayName', user.displayName || '');
    }
  }, [user, loading, router, form]);
  
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
        // Update Firebase Auth profile
        await updateProfile(user, {
            displayName: values.displayName,
        });

        // Update Firestore document
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
            displayName: values.displayName,
        });

        toast({
            title: 'Profile Updated',
            description: 'Your display name has been successfully updated.',
        });
         // This will force a re-render in the layout to show the new name
        router.refresh();
    } catch (error) {
        console.error('Error updating profile:', error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'An error occurred while updating your profile. Please try again.',
        });
    }
  };
  
  if (loading || !user) {
    return (
        <div className="p-4 md:p-8 max-w-lg mx-auto">
            <header className="flex items-center gap-3 mb-8">
                <User className="text-primary h-8 w-8" />
                <h1 className="text-2xl font-bold font-headline text-foreground">
                    User Profile
                </h1>
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
                    <Skeleton className="h-10 w-24 ml-auto" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
        <header className="flex items-center gap-3 mb-8">
            <User className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
                User Profile
            </h1>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Update your display name here.</CardDescription>
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

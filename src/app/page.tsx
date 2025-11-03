// src/app/page.tsx
'use client';

import Link from 'next/link';
import { ChefHat, LogIn, LogOut, History, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Sign out error', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was a problem logging out. Please try again.',
      });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ChefHat className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              FridgeChef AI
            </h1>
          </div>

          {loading ? (
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">Welcome to FridgeChef AI</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Stop wondering what to cook. Just snap a photo of your fridge, and we'll give you delicious recipes you can make right now.
            </p>
        </div>

        <Card className="mt-12 max-w-4xl mx-auto shadow-xl">
            <CardHeader>
                <CardTitle className="text-3xl text-center">How it works</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <ChefHat className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">1. Snap a Photo</h3>
                    <p className="text-muted-foreground">Open your fridge and take a picture. No need to tidy up!</p>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-accent/10 p-4 rounded-full">
                        <ChefHat className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold">2. Get Ingredients</h3>
                    <p className="text-muted-foreground">Our AI instantly identifies all the ingredients in your photo.</p>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-secondary/20 p-4 rounded-full">
                        <ChefHat className="h-10 w-10 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">3. Discover Recipes</h3>
                    <p className="text-muted-foreground">Receive custom recipe suggestions complete with video tutorials.</p>
                </div>
            </CardContent>
        </Card>

        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href={user ? "/dashboard" : "/signup"}>Get Started for Free</Link>
            </Button>
        </div>
      </main>
      <footer className="p-4 border-t mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by Generative AI. Recipes are suggestions and should be prepared with care.</p>
          <p>&copy; {new Date().getFullYear()} FridgeChef AI. All rights reserved.</p>
          <p>Made with ❤️ by <a href="https://www.instagram.com/not_rameen_" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">@not_rameen_</a></p>
        </div>
      </footer>
    </div>
  );
}

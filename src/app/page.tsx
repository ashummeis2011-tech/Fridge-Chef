// src/app/page.tsx
'use client';

import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {

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

            <Button asChild>
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
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
                <Link href="/dashboard">Get Started for Free</Link>
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

// src/app/page.tsx
'use client';

import Link from 'next/link';
import { ChefHat, CookingPot, Leaf, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import placeholderImages from '@/lib/placeholder-images.json';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-20">
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
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center bg-primary/10">
            <div className="container mx-auto z-10 relative">
                <h2 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
                    Transform Your Leftovers into a Feast
                </h2>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Stop wondering what to cook. Just snap a photo of your fridge, and let our AI give you delicious, simple recipes you can make right now.
                </p>
                <div className="mt-8">
                     <Button asChild size="lg">
                        <Link href="/dashboard">Start Cooking for Free</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-background">
            <div className="container mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h3>
                    <p className="text-lg text-muted-foreground">In three simple steps, go from "What's for dinner?" to a delicious meal.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <Card className="flex flex-col items-center">
                        <CardHeader>
                            <div className="bg-primary/10 p-4 rounded-full">
                                <Zap className="h-10 w-10 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl font-semibold mb-2">1. Snap a Photo</CardTitle>
                            <CardDescription>Open your fridge and take a picture. Our AI is smart enough to see past the mess!</CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col items-center">
                         <CardHeader>
                            <div className="bg-accent/10 p-4 rounded-full">
                                <Leaf className="h-10 w-10 text-accent" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl font-semibold mb-2">2. Get Ingredients</CardTitle>
                            <CardDescription>Instantly, we identify every edible item and compile a neat list for you.</CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <CardHeader>
                            <div className="bg-secondary/20 p-4 rounded-full">
                                <CookingPot className="h-10 w-10 text-secondary-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl font-semibold mb-2">3. Discover Recipes</CardTitle>
                            <CardDescription>Receive custom recipe suggestions complete with instructions and video tutorials.</CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline">More Than Just Recipes</h3>
                    <p className="text-lg text-muted-foreground">FridgeChef AI is packed with features to make your life easier and tastier.</p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckIcon />
                            <div>
                                <h4 className="font-semibold">AI-Powered Recognition</h4>
                                <p className="text-muted-foreground text-sm">Our advanced vision AI identifies a wide variety of ingredients, from common vegetables to obscure condiments.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckIcon />
                            <div>
                                <h4 className="font-semibold">Simple & Quick Recipes</h4>
                                <p className="text-muted-foreground text-sm">We prioritize recipes that are easy to follow and can be prepared in under 30 minutes.</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckIcon />
                            <div>
                                <h4 className="font-semibold">Integrated Video Tutorials</h4>
                                <p className="text-muted-foreground text-sm">Each recipe comes with an embedded YouTube search, so you can watch a tutorial without leaving the app.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                   <Image 
                        src={placeholderImages.featureSection.src}
                        alt="A well-organized and stocked refrigerator"
                        fill
                        className="object-cover"
                        data-ai-hint={placeholderImages.featureSection.hint}
                    />
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-background">
            <div className="container mx-auto">
                 <div className="text-center space-y-4 mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline">Loved by Home Cooks</h3>
                    <p className="text-lg text-muted-foreground">See what our users are saying about FridgeChef AI.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                            </div>
                            <p className="italic text-muted-foreground">&quot;I used to waste so much food. Now, I just snap a photo and get amazing ideas. FridgeChef AI is a game-changer for my budget and my creativity!&quot;</p>
                        </CardContent>
                        <CardFooter className="pt-4 flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={placeholderImages.avatar1.src} alt="@jess" data-ai-hint={placeholderImages.avatar1.hint} />
                                <AvatarFallback>J</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Jessica M.</p>
                                <p className="text-sm text-muted-foreground">Busy Mom</p>
                            </div>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                             <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                            </div>
                            <p className="italic text-muted-foreground">&quot;As a student, I live on a tight budget. This app turns my random collection of ingredients into actual, tasty meals. I'm eating better than ever.&quot;</p>
                        </CardContent>
                        <CardFooter className="pt-4 flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={placeholderImages.avatar2.src} alt="@dave" data-ai-hint={placeholderImages.avatar2.hint}/>
                                <AvatarFallback>D</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">David L.</p>
                                <p className="text-sm text-muted-foreground">College Student</p>
                            </div>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                             <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                            </div>
                            <p className="italic text-muted-foreground">&quot;I love to cook but hate meal planning. FridgeChef AI brings back the spontaneity and fun of cooking. Highly recommended!&quot;</p>
                        </CardContent>
                        <CardFooter className="pt-4 flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={placeholderImages.avatar3.src} alt="@sarah" data-ai-hint={placeholderImages.avatar3.hint}/>
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Sarah K.</p>
                                <p className="text-sm text-muted-foreground">Food Enthusiast</p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-20 bg-primary/10">
            <div className="container mx-auto text-center">
                 <h3 className="text-3xl md:text-4xl font-bold font-headline">Ready to Unlock Your Fridge&apos;s Potential?</h3>
                 <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Say goodbye to food waste and hello to delicious, easy meals. Get started in seconds—it&apos;s completely free.
                </p>
                 <div className="text-center mt-8">
                    <Button asChild size="lg">
                        <Link href="/dashboard">Start Cooking Now</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <footer className="p-4 border-t mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by Generative AI. Recipes are suggestions and should be prepared with care.</p>
          <p>&copy; {new Date().getFullYear()} FridgeChef AI. All rights reserved.</p>
          <p>Made with ❤️ by <a href="https://www.instagram.com/not_rameen_" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">@not_rameen_</a></p>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 mt-1 flex-shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

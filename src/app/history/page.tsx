// src/app/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase/provider';
import { collection, getDocs, orderBy, query, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { History, ChefHat, AlertCircle, Home } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface IngredientHistory extends DocumentData {
    id: string;
    ingredients: string[];
    createdAt: Date;
}

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const { firestore } = useFirebase();
    const [history, setHistory] = useState<IngredientHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }
        if (!user) {
            router.push('/login');
            return;
        }
        
        if (!firestore) {
            setError("Could not connect to the database.");
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            try {
                if (!user) return;
                const ingredientsRef = collection(firestore, 'users', user.uid, 'ingredients');
                const q = query(ingredientsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const historyData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ingredients: data.ingredients,
                        createdAt: data.createdAt.toDate(),
                    } as IngredientHistory;
                });
                setHistory(historyData);
            } catch (err) {
                console.error("Error fetching ingredient history:", err);
                setError("Failed to load your ingredient history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (user && firestore) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user, firestore, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="container mx-auto p-4 md:p-8 max-w-3xl animate-in fade-in">
                <Header />
                <div className="space-y-4 mt-8">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-1/3 mt-1" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-1/3 mt-1" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-28 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    // This part is effectively unreachable due to the redirect but is good practice.
    if (!user) {
        return (
            <div className="container mx-auto p-4 md:p-8 max-w-3xl text-center animate-in fade-in">
                 <Header />
                 <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>You need to be logged in to view your history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-3xl animate-in fade-in-50">
            <Header />

             {error && (
                <Alert variant="destructive" className="mt-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4 mt-8">
                {history.length > 0 ? (
                    history.map((item, index) => (
                        <Card key={item.id} className="animate-in fade-in-50" style={{animationDelay: `${index * 100}ms`}}>
                            <CardHeader>
                                <CardTitle className="text-lg">{format(item.createdAt, "MMMM d, yyyy 'at' h:mm a")}</CardTitle>
                                <CardDescription>You saved the following ingredients:</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {item.ingredients.map(ingredient => (
                                        <Badge key={ingredient} variant="secondary">{ingredient}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    !error && !loading && (
                        <Card>
                             <CardHeader>
                                <CardTitle>No History Found</CardTitle>
                                <CardDescription>You haven't saved any ingredients yet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard">Scan your first photo</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        </div>
    );
}

function Header() {
    return (
        <header className="flex items-center justify-between gap-3">
             <div className="flex items-center gap-3">
                <History className="text-primary h-8 w-8" />
                <h1 className="text-2xl font-bold font-headline text-foreground">
                    Ingredient History
                </h1>
            </div>
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </header>
    );
}

    
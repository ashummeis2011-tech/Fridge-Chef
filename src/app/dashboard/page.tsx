// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/auth/use-user';
import { FridgeChefClient } from '@/components/fridge-chef-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
             <header className="p-4 border-b">
                <div className="container mx-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                         <Skeleton className="h-8 w-8 rounded-md" />
                         <Skeleton className="h-6 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <Skeleton className="h-9 w-3/4 mx-auto rounded-md" />
                        <Skeleton className="h-5 w-full max-w-lg mx-auto rounded-md" />
                    </div>
                     <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </main>
        </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8">
      <FridgeChefClient />
    </main>
  );
}

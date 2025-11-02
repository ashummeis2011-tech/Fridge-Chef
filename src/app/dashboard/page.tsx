// src/app/dashboard/page.tsx
'use client';

import { FridgeChefClient } from '@/components/fridge-chef-client';
import { useAuth } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
      <div className="p-4 md:p-8 animate-in fade-in">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Skeleton className="h-9 w-3/4 mx-auto rounded-md" />
            <Skeleton className="h-5 w-full max-w-lg mx-auto rounded-md" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }


  return (
      <div className="flex-1 p-4 md:p-8 overflow-auto animate-in fade-in-50">
        <FridgeChefClient />
      </div>
  );
}

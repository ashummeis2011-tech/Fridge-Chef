// src/app/dashboard/page.tsx
'use client';

import { FridgeChefClient } from '@/components/fridge-chef-client';

export default function DashboardPage() {
  return (
      <div className="flex-1 p-4 md:p-8 overflow-auto animate-in fade-in-50">
        <FridgeChefClient />
      </div>
  );
}

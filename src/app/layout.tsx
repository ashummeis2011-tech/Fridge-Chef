// src/app/layout.tsx
'use client';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { ChefHat, History, Home, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';


function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  // Paths that do not require the full sidebar layout
  const simpleLayoutPaths = ['/login', '/signup'];
  let useSimpleLayout = simpleLayoutPaths.includes(pathname);

  // The root path '/' should also be simple
  if (pathname === '/') {
    useSimpleLayout = true;
  }
  
  // If we are on a simple layout path, render just the children.
  if (useSimpleLayout) {
    return <main className="flex-1">{children}</main>;
  }


  return (
    <>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <ChefHat className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold">FridgeChef</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                        <Link href="/dashboard"><Home />Dashboard</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/history'}>
                        <Link href="/history"><History />History</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
         <header className="p-2 border-b flex items-center justify-between gap-3 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            {isMobile && <Button variant="ghost" size="icon" onClick={toggleSidebar}><PanelLeft /></Button>}
             <div className="flex-1" />
        </header>
        {children}
      </SidebarInset>
    </>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
   // We can now safely wrap AppContent in SidebarProvider at the top level
   // because AppContent itself will handle whether to show the simple or full layout.
  return (
    <SidebarProvider>
      <AppContent>{children}</AppContent>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>FridgeChef AI</title>
        <meta name="description" content="Generate recipes from a photo of your fridge!" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased h-full flex flex-col" suppressHydrationWarning>
        <FirebaseProvider>
            <AppLayout>
              {children}
            </AppLayout>
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}

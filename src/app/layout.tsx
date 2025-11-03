// src/app/layout.tsx
'use client';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { ChefHat, History, Home, LogIn, LogOut, PanelLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase/provider';


function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, toggleSidebar } = useSidebar();
  const { auth } = useFirebase();

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
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

  // Paths that do not require the full sidebar layout
  const simpleLayoutPaths = ['/login', '/signup'];
  let useSimpleLayout = simpleLayoutPaths.includes(pathname);

  // The root path '/' should also be simple if the user is not logged in.
  if (pathname === '/' && !user && !loading) {
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
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
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
            ): (
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                </Button>
            )}
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

import { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, ClipboardList, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user?.role === "admin") {
    redirect("/login");
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='w-64 bg-white shadow-lg'>
        <div className='p-4'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold'>Admin Panel</h2>
            <Button variant='ghost' size='icon' onClick={() => signOut()}>
              <LogOut className='h-4 w-4' />
            </Button>
          </div>

          {/* Navigation */}
          <nav className='space-y-2'>
            <Button
              variant='ghost'
              className='w-full justify-start'
              href='/admin/clipboards'
            >
              <ClipboardList className='mr-2 h-4 w-4' />
              Clipboards
            </Button>
            <Button
              variant='ghost'
              className='w-full justify-start'
              href='/admin/clipboards/new'
            >
              <Plus className='mr-2 h-4 w-4' />
              New Clipboard
            </Button>
            <Button
              variant='ghost'
              className='w-full justify-start'
              href='/admin/settings'
            >
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Clipboards</h1>
          <div className='flex items-center gap-4'>
            <Button variant='outline'>
              <Search className='mr-2 h-4 w-4' />
              Search
            </Button>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              New Clipboard
            </Button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

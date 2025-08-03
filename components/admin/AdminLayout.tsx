"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  LogOut,
  Users,
  UserPlus,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../AuthProvider";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Will fix later
  // useEffect(() => {
  //   if (!loading && (!user || user.role !== "admin")) {
  //     router.push("/login?callbackUrl=/admin");
  //   }
  // }, [user, loading, router]);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "Clipboards",
      href: "/admin/clipboards",
      icon: LayoutDashboard,
      active: pathname === "/admin/clipboards",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users") && !pathname.endsWith("/new"),
    },
    {
      name: "Add User",
      href: "/admin/users/new",
      icon: UserPlus,
      active: pathname.endsWith("/new"),
    },
  ];

  if (loading || !user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-background'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground flex'>
      {/* <SidebarLink href='/admin/clipboards' icon={ClipboardIcon}>
        Clipboards
      </SidebarLink> */}
      {/* Sidebar */}
      <div className='w-64 border-r bg-card'>
        <div className='p-4 border-b'>
          <h1 className='text-xl font-bold text-card-foreground'>
            Admin Panel
          </h1>
        </div>
        <nav className='p-4 space-y-1'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className='mr-3 h-5 w-5 flex-shrink-0' />
              {item.name}
            </Link>
          ))}
          <Separator className='my-2' />
          <button
            onClick={() => signOut()}
            className='flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors'
          >
            <LogOut className='mr-3 h-5 w-5 flex-shrink-0' />
            Sign out
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}

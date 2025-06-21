"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/db/userFunctions";
import { User } from "@/lib/types/users";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  loadingComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  loadingComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await userService.getCurrentUser();

        if (!currentUser) {
          // No user is logged in, redirect to login
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        setUser(currentUser);

        if (adminOnly && currentUser.prefs.role !== "admin") {
          // User is not an admin but trying to access an admin route
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast({
          title: "Error",
          description:
            "An error occurred while checking your authentication status.",
          variant: "destructive",
        });
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, adminOnly, toast]);

  // Show loading state
  if (isLoading) {
    return (
      loadingComponent || (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='flex flex-col items-center space-y-4'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <p>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // If we have a user and they have the right permissions, render the children
  if (user && (!adminOnly || user.prefs.role === "admin")) {
    return <>{children}</>;
  }

  // Default return (shouldn't reach here due to redirects, but just in case)
  return null;
}

export default ProtectedRoute;

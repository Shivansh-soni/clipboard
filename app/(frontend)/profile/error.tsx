"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='container py-8 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences
        </p>
      </div>

      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error loading profile</AlertTitle>
        <AlertDescription className='space-y-4'>
          <p>An error occurred while loading your profile. Please try again.</p>
          <div>
            <Button variant='outline' onClick={() => reset()}>
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

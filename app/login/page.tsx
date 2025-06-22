"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { login } from "@/lib/appwrite";

export default function LoginPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectTo = "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(
        error.message || "Failed to sign in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <div className='flex justify-center mb-4'>
            <Icons.logo className='h-12 w-12' />
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-foreground/70'>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-foreground'>
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                autoCapitalize='none'
                autoCorrect='off'
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@example.com'
                className='h-11'
                required
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-foreground'>
                  Password
                </Label>
                <a
                  href='/forgot-password'
                  className='text-sm font-medium text-primary hover:underline'
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className='h-11'
                required
              />
            </div>

            {error && (
              <div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full h-11 text-base'
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

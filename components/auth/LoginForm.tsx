"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/db/userFunctions";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await userService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className='w-full max-w-md mx-auto space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Welcome back</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Enter your credentials to sign in to your account
        </p>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='m@example.com'
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
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
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='remember'
            name='rememberMe'
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                rememberMe: checked as boolean,
              }))
            }
            disabled={isLoading}
          />
          <Label htmlFor='remember'>Remember me</Label>
        </div>
        <Button className='w-full' type='submit' disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className='text-center text-sm'>
        Don&apos;t have an account?{" "}
        <a href='/signup' className='font-medium text-primary hover:underline'>
          Sign up
        </a>
      </div>
    </div>
  );
}

export default LoginForm;

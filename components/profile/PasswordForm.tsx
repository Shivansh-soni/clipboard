"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { userService } from "@/lib/db/userFunctions";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password is required",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    try {
      setIsLoading(true);

      const success = await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPasswordAgain: data.confirmPassword,
      });

      if (!success) {
        throw new Error("Failed to update password");
      }

      form.reset();

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='currentPassword'>Current Password</Label>
          <Input
            id='currentPassword'
            type='password'
            placeholder='Enter your current password'
            {...form.register("currentPassword")}
          />
          {form.formState.errors.currentPassword && (
            <p className='text-sm text-red-500'>
              {form.formState.errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='newPassword'>New Password</Label>
          <Input
            id='newPassword'
            type='password'
            placeholder='Enter your new password'
            {...form.register("newPassword")}
          />
          {form.formState.errors.newPassword ? (
            <p className='text-sm text-red-500'>
              {form.formState.errors.newPassword.message}
            </p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Must be at least 8 characters with uppercase, lowercase, number,
              and special character.
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirm New Password</Label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder='Confirm your new password'
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className='text-sm text-red-500'>
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update Password
        </Button>
      </div>
    </form>
  );
}

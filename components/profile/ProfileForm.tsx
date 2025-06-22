"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { account } from "@/lib/appwrite";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user: any }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    form.setValue("name", user?.name || "");
    form.setValue("email", user?.email || "");
  }, [user]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);

      // Update the user's name in Appwrite
      await account.updateName(data.name);

      // If email is being changed, we need to handle that separately
      if (data.email !== user.email) {
        // Note: In Appwrite, changing email requires email verification
        await account.updateEmail(data.email, window.location.href);

        toast({
          title: "Email update requested",
          description:
            "Please check your email to verify your new email address.",
        });
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating profile:", error);

      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
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
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            placeholder='Your name'
            {...form.register("name")}
            disabled={isLoading}
          />
          {form.formState.errors.name && (
            <p className='text-sm text-red-500'>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='Your email'
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && (
            <p className='text-sm text-red-500'>
              {form.formState.errors.email.message}
            </p>
          )}
          <p className='text-sm text-muted-foreground'>
            Changing your email will require verification.
          </p>
        </div>
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isLoading || !form.formState.isDirty}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update Profile
        </Button>
      </div>
    </form>
  );
}

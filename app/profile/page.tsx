"use client";
import { redirect } from "next/navigation";
import { account } from "@/lib/appwrite";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
// import { AccountSettingsForm } from "@/components/profile/AccountSettingsForm";
import { useAuth } from "@/lib/context/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, signOut } = useAuth();
  console.log("user", user);
  try {
    // If no user is found, redirect to login
    // if (!user) {
    //   redirect("/login?callbackUrl=/profile");
    // }

    return (
      <div className='p-8 space-y-6 w-full'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and preferences
          </p>
        </div>

        <Separator className='my-6' />

        <Tabs defaultValue='profile' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='password'>Password</TabsTrigger>
            <TabsTrigger value='settings'>Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value='profile' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account's profile information and email address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='password' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                  Ensure your account is using a long, random password to stay
                  secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value='settings' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Configure your application preferences and notification
                  settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSettingsForm initialData={user} />
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    // redirect("/login?callbackUrl=/profile");
  }
}

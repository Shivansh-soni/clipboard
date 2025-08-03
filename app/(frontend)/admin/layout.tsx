"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { AuthProvider } from "@/components/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}

export const dynamic = "force-dynamic";

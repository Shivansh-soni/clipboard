"use client";

import AdminLayout from "@/components/admin/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

export const dynamic = "force-dynamic";

"use client";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const checkAuth = async () => {
    const user = await account.get();
    if (user) {
      router.push("/admin");
    }
  };
  checkAuth();
}

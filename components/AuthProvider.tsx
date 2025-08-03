"use client";
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import cookie from "js-cookie";
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  // signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = cookie.get("token");
  const pathname = usePathname();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }
        const res = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = { ...res.data.user, password: "" };

        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        if (
          !pathname.includes("api") ||
          !pathname.includes("auth") ||
          !pathname.includes("clipboard")
        ) {
          router.push("/auth/login");
        }
        // setError(error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      // await axios.post("/api/auth/signout");
      cookie.remove("token");
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.log("Sign out failed:", error);
      // setError(error);
    } finally {
      setLoading(false);
    }
  };
  const isAuthenticated = !loading && !!user;
  return (
    <AuthContext.Provider
      value={{ user, loading, error, signOut, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

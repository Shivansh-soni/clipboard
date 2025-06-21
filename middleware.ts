import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

const publicPaths = ["/login", "/_next", "/favicon.ico"];

export async function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Skip middleware for public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  //   try {
  //     // Check for existing session
  //     const session = await account.getSession("current").catch(() => null);

  //     if (!session) {
  //       const loginUrl = new URL("/login", request.url);
  //       // Add redirect URL for after login
  //       if (pathname !== "/") {
  //         loginUrl.searchParams.set("redirect", pathname);
  //       }
  //       return NextResponse.redirect(loginUrl);
  //     }

  //     // Get user data
  //     const user = await account.get();

  //     // Create headers for the request
  //     const requestHeaders = new Headers(request.headers);

  //     // Add user info to headers
  //     requestHeaders.set("x-user-id", user.$id);
  //     requestHeaders.set("x-user-email", user.email);
  //     requestHeaders.set("x-user-name", user.name);
  //     requestHeaders.set(
  //       "x-is-admin",
  //       String(user.labels?.includes("admin") || false)
  //     );

  //     // Clone the request with new headers
  //     const response = NextResponse.next({
  //       request: {
  //         headers: requestHeaders,
  //       },
  //     });

  //     // Add security headers
  //     response.headers.set("x-content-type-options", "nosniff");
  //     response.headers.set("x-frame-options", "DENY");
  //     response.headers.set("x-xss-protection", "1; mode=block");

  //     return response;
  //   } catch (error) {
  //     console.error("Middleware error:", error);
  //     const loginUrl = new URL("/login", request.url);
  //     loginUrl.searchParams.set("error", "session_expired");
  //     return NextResponse.redirect(loginUrl);
  //   }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

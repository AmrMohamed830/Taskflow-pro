import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const nextAuthToken = 
        request.cookies.get("next-auth.session-token")?.value || 
        request.cookies.get("__Secure-next-auth.session-token")?.value;

    const { pathname } = request.nextUrl;

    const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");

    const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/profile");

    const hasSession = !!(token || nextAuthToken);

    if (isProtectedRoute && !hasSession) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/auth";
import ToasterProvider from "@/components/providers/toaster-provider";

const queryClient = new QueryClient();

function AuthSync() {
    const { data: session } = useSession();
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        if (session?.backendToken) {
            Cookies.set("token", session.backendToken, { expires: 7 });
            if (session.backendUser) {
                setUser(session.backendUser);
            }
        } else if (!session && !Cookies.get("token")) {
            logout();
        }
    }, [session, setUser, logout]);

    return null;
}

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <AuthSync />
                <ToasterProvider />
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
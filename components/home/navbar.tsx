"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { SquareCheckBig, Menu, LogOut, Loader2 } from "lucide-react";
import ThemeToggle from "../global/theme";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/store/auth";
import Cookies from "js-cookie";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { user, setUser, logout } = useAuth();
    const { data: session, status } = useSession();

    useEffect(() => {
        
        // 1. التعامل مع NextAuth (Google/GitHub)
        if (status === "authenticated" && session?.user) {
            // التحقق لتجنب التحديث اللانهائي (Infinite Loop)
            if (!user || user.email !== session.user.email) {
                setUser({
                    id: user?.id || "",
                    role: user?.role || "user",
                    name: session.user.name || "",
                    email: session.user.email || "",
                    avatar: session.user.image || "",
                });
            }
            // Use setTimeout to avoid "setState synchronously within an effect" warning
            setTimeout(() => setIsInitialLoading(false), 0);
        }
        // 2. التعامل مع الـ Token اليدوي (Email/Password)
        else if (status === "unauthenticated") {
            setTimeout(() => {
                setIsInitialLoading(false);
            }, 0);
        }
        // 3. حالة التحميل الأساسية لـ NextAuth
        else if (status === "loading") {
            setTimeout(() => setIsInitialLoading(true), 0);
        }
    }, [session, status, setUser, user]);

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false }); // تسجيل خروج من NextAuth
            logout(); // تسجيل خروج من Zustand والـ Cookies
        } catch (error) {
            console.error("Logout failed:", error);
            logout(); // التأكد من المسح حتى لو فشل NextAuth
        }
    };

    const isLoggedIn = !!user;
    const userAvatar = session?.user?.image || user?.avatar || user?.image;

    return (
        <nav className="border-b relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                    <SquareCheckBig className="w-6 h-6 text-brand" />
                    <span className="text-xl font-bold tracking-tight">
                        TaskFlow
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-4">
                    <ThemeToggle />

                    {isInitialLoading ? (
                        <div className="flex items-center justify-center w-[100px]">
                            <Loader2 className="w-5 h-5 animate-spin text-brand" />
                        </div>
                    ) : isLoggedIn ? (
                        <div className="flex items-center gap-4 animate-in fade-in duration-500">
                            {/* 🔥 زرار الداشبورد */}
                            <Link href="/dashboard">
                                <Button
                                    variant="outline"
                                    className="font-medium"
                                >
                                    Dashboard
                                </Button>
                            </Link>

                            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
                                {userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={user?.name || "User"}
                                        className="w-8 h-8 rounded-full object-cover border border-brand/20"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <span className="text-sm font-semibold max-w-[120px] truncate">
                                    {user?.name}
                                </span>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 animate-in fade-in duration-500">
                            <Link href="/login">
                                <Button variant="ghost" className="font-medium">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    variant="taskflow"
                                    className="font-medium px-6 shadow-sm"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(!open)}
                        className="rounded-full"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>

                {/* Mobile Dropdown */}
                {open && (
                    <div className="absolute top-[72px] right-0 left-0 border-b bg-background z-50 shadow-xl animate-in slide-in-from-top duration-300 sm:hidden">
                        <div className="p-4 flex flex-col gap-4">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Button className="w-full font-medium">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border">
                                        {userAvatar ? (
                                            <img
                                                src={userAvatar}
                                                className="w-12 h-12 rounded-full object-cover"
                                                alt={user?.name || "User"}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xl">
                                                {user?.name?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-base">
                                                {user?.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="destructive"
                                        className="w-full justify-center gap-2 font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full font-medium"
                                        >
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Button
                                            variant="taskflow"
                                            className="w-full font-medium"
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

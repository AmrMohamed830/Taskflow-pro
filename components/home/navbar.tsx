"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { SquareCheckBig, Menu, LogOut } from "lucide-react";
import ThemeToggle from "../global/theme";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import { getMe } from "@/lib/api/auth";
import Cookies from "js-cookie";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const { user, setUser, logout } = useAuthStore();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session?.user) {
            setUser({
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
            });
        }
    }, [session, setUser]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("token");
            if (token && !user) {
                try {
                    const userData = await getMe();
                    setUser({
                        name: userData.data.name,
                        email: userData.data.email,
                        image: userData.data.image || "",
                    });
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                }
            }
        };
        fetchUser();
    }, [user, setUser]);

    const isLoggedIn = !!user;
    return (
        <nav className=" border-b-1 relative">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]  ">
                <div className="flex items-center gap-3 ">
                    <SquareCheckBig className="w-5 h-5 text-brand" />
                    <span className="text-xl font-bold">TaskFlow</span>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                    <ThemeToggle />

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    className="w-10 h-10 rounded-full border-2 border-brand"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
                                    {user?.name?.[0] || "U"}
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    signOut(); // NextAuth
                                    logout(); // Backend/Zustand
                                }}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button className="px-6 py-5  bg-transparent text-accent-foreground hover:bg-brand transition duration-300">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="taskflow" size="lg">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="sm:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <button onClick={() => setOpen(!open)}>
                        <Menu />
                    </button>
                </div>

                {open && (
                    <div className="absolute top-[72px] right-0 w-[200px] border-b-2 border-l-2 z-50 shadow-lg bg-background p-4 flex flex-col gap-3 sm:hidden">
                        {isLoggedIn ? (
                            <>
                                <div className="flex items-center gap-2 px-2 py-2">
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            className="w-8 h-8 rounded-full border-1 border-brand"
                                            alt={user.name || "User"}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                                            {user?.name?.[0] || "U"}
                                        </div>
                                    )}

                                    <span className="text-sm font-medium truncate">
                                        {user?.name}
                                    </span>
                                </div>

                                <Button
                                    onClick={() => {
                                        signOut();
                                        logout();
                                    }}
                                    variant="destructive"
                                    className="w-full justify-start gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button className="w-full bg-transparent text-accent-foreground hover:bg-brand transition duration-300">
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full bg-brand text-brand-foreground">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

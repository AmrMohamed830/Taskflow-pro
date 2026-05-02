"use client";
import {
    SidebarIcon,
    SquareCheckBig,
    LayoutDashboard,
    Kanban,
    Users,
    Settings,
    LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";

import Link from "next/link";

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { data: session } = useSession();

    const links = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Kanban Board", icon: Kanban, href: "/dashboard/kanban" },
        { name: "Users", icon: Users, href: "/dashboard/users" },
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            logout();
        } catch (error) {
            console.error("Logout failed:", error);
            logout();
        }
    };

    return (
        <aside className="w-64 border-r h-screen sticky top-0 flex flex-col bg-background">
            {/* Header */}
            <div className="flex justify-between items-center h-[72px] border-b px-4 flex-shrink-0">
                <Link
                    href="/"
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                    <SquareCheckBig className="w-6 h-6 text-brand" />
                    <span className="text-xl font-bold tracking-tight">
                        TaskFlow
                    </span>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <SidebarIcon className="w-5 h-5" />
                </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-3">
                <div className="flex flex-col gap-1">
                    {links.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group
                                    ${isActive
                                        ? "bg-brand text-black font-semibold shadow-sm"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-black" : "group-hover:text-foreground"}`} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar Footer - User Profile & Logout */}
            <div className="mt-auto border-t p-4 bg-secondary/10">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Profile Image */}
                        <div className="relative flex-shrink-0">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    className="w-10 h-10 rounded-full border border-border object-cover"
                                    alt={user.name}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold">
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-sm font-bold truncate">
                                    {user?.name}
                                </span>
                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md bg-brand/10 text-[9px] font-bold text-brand uppercase tracking-wider">
                                    {user?.role === "ADMIN" ? "Admin" : "User"}
                                </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground truncate" title={user?.email}>
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full h-9 w-9"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

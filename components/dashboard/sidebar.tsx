"use client";
import { useState, useEffect } from "react";
import {
    SidebarIcon,
    SquareCheckBig,
    LayoutDashboard,
    Kanban,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/auth";
import { useUIStore } from "@/lib/store/ui";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/auth";
import Link from "next/link";

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
    const { data: session } = useSession();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 771;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggleSidebarAction = () => {
        if (isMobile) {
            toggleSidebar();
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const links = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Kanban Board", icon: Kanban, href: "/dashboard/kanban" },
        ...(user?.role === "admin"
            ? [{ name: "Users", icon: Users, href: "/dashboard/users" }]
            : []),
        { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    ];

    const handleLogout = async () => {
        try {
            if (session) {
                await signOut({ redirect: false });
            } else {
                await logoutUser();
            }

            logout();

            router.replace("/login");
        } catch (error) {
            console.error(error);

            logout();

            router.replace("/login");
        }
    };

    const userImage =
        session?.user?.image ?? (user as { image?: string })?.image;

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 min-[771px]:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "border-r h-screen bg-background transition-all duration-300 z-50 flex flex-col overflow-x-hidden flex-shrink-0",
                    // Desktop styles
                    "min-[771px]:sticky min-[771px]:top-0 min-[771px]:translate-x-0",
                    isCollapsed ? "min-[771px]:w-20" : "min-[771px]:w-64",
                    // Mobile styles
                    "fixed inset-y-0 left-0 w-[280px] shadow-2xl min-[771px]:shadow-none",
                    isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full min-[771px]:translate-x-0",
                )}
            >
                {/* Header */}
                <div
                    className={cn(
                        "flex items-center h-[72px] border-b px-4 flex-shrink-0 transition-all duration-300",
                        isCollapsed
                            ? "min-[771px]:justify-center"
                            : "justify-between",
                    )}
                >
                    <Link
                        href="/"
                        className={cn(
                            "items-center gap-3 hover:opacity-90 transition-all duration-300 overflow-hidden whitespace-nowrap",
                            isCollapsed ? "min-[771px]:hidden" : "flex",
                        )}
                    >
                        <SquareCheckBig className="w-6 h-6 text-brand" />
                        <span className="text-xl font-bold tracking-tight">
                            TaskFlow
                        </span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                        onClick={toggleSidebarAction}
                    >
                        {isMobile ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <SidebarIcon
                                className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    isCollapsed && "rotate-180",
                                )}
                            />
                        )}
                    </Button>
                </div>

                {/* Navigation Links */}
                <div
                    className={cn(
                        "flex-1 overflow-y-auto py-6 transition-all duration-300 overflow-x-hidden",
                        isCollapsed ? "min-[771px]:px-2" : "px-3",
                    )}
                >
                    <div className="flex flex-col gap-1.5">
                        {links.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-xl py-2.5 transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-brand text-black font-bold shadow-md shadow-brand/20"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                        isCollapsed
                                            ? "min-[771px]:justify-center min-[771px]:px-0 min-[771px]:gap-0"
                                            : "px-3 gap-3",
                                    )}
                                    onClick={() =>
                                        isMobile && setSidebarOpen(false)
                                    }
                                >
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-colors flex-shrink-0",
                                            isActive
                                                ? "text-black"
                                                : "group-hover:text-foreground",
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
                                            isCollapsed
                                                ? "min-[771px]:hidden"
                                                : "block",
                                        )}
                                    >
                                        {item.name}
                                    </span>

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden min-[771px]:block">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Footer - User Profile & Logout */}
                <div className="mt-auto border-t p-4 bg-secondary/5 overflow-hidden">
                    <div
                        className={cn(
                            "flex items-center justify-between gap-3",
                            isCollapsed
                                ? "min-[771px]:flex-col min-[771px]:gap-4"
                                : "",
                        )}
                    >
                        <div
                            className={cn(
                                "flex items-center min-w-0",
                                isCollapsed
                                    ? "min-[771px]:justify-center min-[771px]:gap-0"
                                    : "gap-3",
                            )}
                        >
                            {/* Profile Image */}
                            <div className="relative flex-shrink-0">
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        className="w-10 h-10 rounded-full border border-border shadow-sm object-cover"
                                        alt={user?.name ?? "User"}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold shadow-sm">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full shadow-sm"></div>
                            </div>

                            {/* User Info */}
                            <div
                                className={cn(
                                    "flex flex-col min-w-0 transition-all duration-300",
                                    isCollapsed ? "min-[771px]:hidden" : "flex",
                                )}
                            >
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <span className="text-sm font-bold truncate">
                                        {user?.name}
                                    </span>
                                    <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md bg-brand/10 text-[9px] font-bold text-brand uppercase tracking-wider">
                                        {user?.role === "admin"
                                            ? "admin"
                                            : "User"}
                                    </span>
                                </div>
                                <span
                                    className="text-[11px] text-muted-foreground truncate"
                                    title={user?.email}
                                >
                                    {user?.email}
                                </span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className={cn(
                                "flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full h-9 w-9",
                                isCollapsed
                                    ? "min-[771px]:h-10 min-[771px]:w-10"
                                    : "",
                            )}
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

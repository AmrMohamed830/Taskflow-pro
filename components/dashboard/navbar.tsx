"use client";
import { Search, Bell, Menu } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { Button } from "../ui/button";

const Navbar = () => {
    const { toggleSidebar, isSidebarOpen } = useUIStore();

    return (
        <nav className="flex items-center h-[72px] border-b px-4">
            {/* Mobile Burger Menu Button */}
            {!isSidebarOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="min-[771px]:hidden mr-2 h-10 w-10 text-brand hover:bg-brand/10 transition-colors"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-6 h-6" />
                </Button>
            )}

            <div className="flex items-center gap-3 w-full justify-end">
                
                {/* Search */}
                <div className="relative flex-1 min-w-0 max-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="
                            w-full
                            pl-10 pr-4 py-2
                            rounded-lg
                            border border-border
                            bg-background
                            text-sm

                            focus:outline-none
                            focus:border-brand
                            focus:ring-4
                            focus:ring-brand/30

                            transition-all
                        "
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-brand hover:text-black transition shrink-0">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
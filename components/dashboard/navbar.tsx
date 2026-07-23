"use client";
import React, { useState } from "react";
import { Search, Bell, Menu, X } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { Button } from "../ui/button";
import { useFilterStore } from "@/lib/store/filters";
import { usePathname } from "next/navigation";
import {
  useNotifications,
  useMarkNotificationsRead,
  useDeleteNotification,
} from "@/lib/hooks/notifications/useNotifications";
import type { Notification as DbNotification } from "@/lib/types/notifications";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const Navbar = () => {
  const { toggleSidebar, isSidebarOpen } = useUIStore();
  const { search, setSearch } = useFilterStore();
  const pathname = usePathname();

  const showSearch =
    pathname === "/dashboard/kanban" || pathname === "/dashboard/users";

  // Notifications State & Hooks
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data: notificationsData } = useNotifications();
  const { mutate: markAllRead } = useMarkNotificationsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = notificationsData?.data ?? [];
  const unreadCount = notifications.filter(
    (n: DbNotification) => n.unread,
  ).length;

  const handleMarkAllRead = () => {
    markAllRead();
  };

  const handleClearNotification = (id: string) => {
    deleteNotification(id);
  };

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

      <div className="flex items-center gap-3 w-full justify-end relative">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 min-w-0 max-w-[300px] mr-auto sm:mr-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-lg transition shrink-0 cursor-pointer ${
              isNotificationsOpen
                ? "bg-brand text-black"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand rounded-full border-2 border-background animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-card text-foreground shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
                  <h4 className="text-sm font-extrabold text-foreground">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-brand hover:underline font-bold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex flex-col max-h-80 overflow-y-auto divide-y divide-border/30">
                  {notifications.length > 0 ? (
                    notifications.map((n: DbNotification) => (
                      <div
                        key={n._id}
                        className={`flex flex-col gap-1 p-3.5 hover:bg-secondary/30 transition-colors relative group
                          ${n.unread ? "bg-brand/5" : ""}`}
                      >
                        {n.unread && (
                          <span className="absolute left-3.5 top-5 h-2 w-2 rounded-full bg-brand" />
                        )}
                        <div className="flex items-start justify-between pl-4 gap-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-foreground">
                              {n.title}
                            </span>
                            <span className="text-xs text-muted-foreground leading-relaxed">
                              {n.description}
                            </span>
                            <span className="text-[10px] text-muted-foreground/55 font-semibold mt-1">
                              {formatRelativeTime(n.createdAt)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleClearNotification(n._id)}
                            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground text-center">
                      <Bell className="h-8 w-8 opacity-25 animate-bounce" />
                      <p className="text-xs font-extrabold">All caught up!</p>
                      <p className="text-[10px] opacity-60">
                        No new notifications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

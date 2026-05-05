import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 p-6 pt-20 min-[771px]:pt-6 min-w-0">
                {children}
            </main>
        </div>
    );
}

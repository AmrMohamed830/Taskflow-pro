import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <main className="flex-1 p-6 pt-20 min-[771px]:pt-6 min-w-0 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

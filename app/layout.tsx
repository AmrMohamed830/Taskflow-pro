import type { Metadata } from "next";
import "./globals.css";
import { Cairo, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/providers/theme-provider";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-cairo",
});

export const metadata: Metadata = {
    title: "TaskFlow Pro",
    description: "Team Task Management SaaS",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(cairo.variable, geist.variable, "font-sans")}
            suppressHydrationWarning
        >
            <body>
                <Providers>
                    <ThemeProvider>{children}</ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}

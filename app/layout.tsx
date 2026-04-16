import type { Metadata } from "next";
import "./globals.css";
import { Cairo, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/providers/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
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
            className={cn(cairo.className, "font-sans", geist.variable)}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}

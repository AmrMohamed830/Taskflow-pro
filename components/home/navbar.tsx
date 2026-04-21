"use client";
import { useState } from "react";
import { SquareCheckBig, Menu } from "lucide-react";
import ThemeToggle from "../global/theme";
import { Button } from "../ui/button";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    return (
        <nav className=" border-b-1 relative">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]  ">
                <div className="flex items-center gap-3 ">
                    <SquareCheckBig className="w-5 h-5 text-brand" />
                    <h1 className="text-xl font-bold">TaskFlow</h1>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                    <ThemeToggle />
                    <Button className="px-6 py-5  bg-transparent text-accent-foreground hover:bg-brand transition duration-300">
                        Sign in
                    </Button>
                    <Button variant="taskflow" size="lg" >
                        Get Started
                    </Button>
                </div>

                <div className="sm:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <button onClick={() => setOpen(!open)}>
                        <Menu />
                    </button>
                </div>
                {open && (
                    <div className="absolute top-[72px] right-0 w-[200px] border-b-2 border-l-2 z-50 shadow-lg bg-background p-4 flex flex-col gap-3 sm:hidden">
                        <Button className=" bg-transparent text-accent-foreground hover:bg-brand transition duration-300">
                            Sign in
                        </Button>
                        <Button className="bg-brand text-brand-foreground">
                            Get Started
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

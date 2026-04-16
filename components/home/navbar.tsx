import { SquareCheckBig } from "lucide-react";
import ThemeToggle from "../global/theme";
import { Button } from "../ui/button";

const Navbar = () => {
    return (
        <div className=" border-b-2">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]  ">
                <div className="flex items-center gap-3 ">
                    <SquareCheckBig className="w-5 h-5 text-brand" />
                    <h1 className="text-xl font-bold">TaskFlow</h1>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle/>
                    <Button className="px-6 py-5  bg-transparent text-accent-foreground hover:bg-brand transition duration-300">
                        sign in
                    </Button>
                    <Button className="bg-brand px-6 py-5 text-black hover:bg-[#00bc83] transition duration-300">
                        Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

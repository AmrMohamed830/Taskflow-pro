import { SquareCheckBig } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <footer className="py-10">
            <div className="max-w-7xl mx-auto px-4 flex items-center flex-col gap-4 sm:flex-row sm:gap-0 justify-between">
                <div className="flex items-center gap-3 ">
                    <SquareCheckBig className="w-5 h-5 text-brand" />
                    <h1 className="text-xl font-bold">TaskFlow</h1>
                </div>
                <div className=" text-gray-500">
                    © {new Date().getFullYear()} TaskFlow Pro. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

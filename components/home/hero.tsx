import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
const Hero = () => {
    return (
        <section className="py-30 border-b-1">
            <div className="max-w-7xl mx-auto px-4 flex justify-center items-center ">
                <div className="max-w-2xl flex flex-col gap-6 items-center">
                    <div className="flex gap-3 bg-secondary-brand text-brand px-4 py-1 rounded-2xl">
                        <Sparkles className="w-4" />
                        <h4>Modern Task Management</h4>
                    </div>
                    <h1 className="text-4xl md:text-6xl text-center font-bold">
                        Organize your work,{" "}
                        <span className="text-brand">
                            amplify your productivity
                        </span>
                    </h1>
                    <p className="text-center text-gray-brand text-[19px]">
                        TaskFlow is the modern task management platform that
                        helps teams stay organized, focused, and productive.
                        Visualize your workflow with our intuitive Kanban board.
                    </p>
                    <div className="flex gap-3">
                        <Link href="/register">
                            <Button
                                variant="taskflow"
                                size="lg"
                                className="gap-5"
                            >
                                Get Started
                                <ArrowRight />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="px-6 py-5  bg-secondary-brand text-accent-foreground hover:bg-brand transition duration-300">
                                Sign in
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
const Hero = () => {
    return (
        <section className="py-31 border-b-1">
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
                    <p className="text-center text-[#8f8f8f] text-[19px]">
                        TaskFlow is the modern task management platform that
                        helps teams stay organized, focused, and productive.
                        Visualize your workflow with our intuitive Kanban board.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="taskflow" size="lg" className="gap-5">
                            Get Started
                            <ArrowRight />
                        </Button>
                        <Button className="px-6 py-5  bg-transparent text-accent-foreground hover:bg-brand transition duration-300">
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

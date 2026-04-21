import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
    return (
        <section className="py-25 border-b-1">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center text-center gap-6 bg-secondary-brand py-13 rounded-2xl">
                    <h2 className="font-bold text-[40px]">Ready to get started?</h2>
                    <p className="text-gray-brand">
                        Join thousands of teams already using TaskFlow to boost
                        their productivity.
                    </p>
                    <Button variant="taskflow" size="lg" className="gap-5">
                        Create Free Account
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;

import { Zap } from "lucide-react";

const FeaturesSection = () => {
    return (
        <section className="py-25 border-b-1">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-20">
                    <h2 className="mb-3 text-3xl md:text-[40px] text-center font-bold">
                        Everything you need to stay productive
                    </h2>
                    <p className="text-center font-medium text-[20px] text-gray-brand">
                        Powerful features designed to help you and your team
                        accomplish more
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-start">
                    {[
                        { title: "Lightning Fast", desc: "Blazing fast performance with real-time updates across all your devices" },
                        { title: "Team Collaboration", desc: "Work together seamlessly with your team members in real-time" },
                        { title: "Secure Data", desc: "Your data is encrypted and stored safely with enterprise-grade security" },
                        { title: "Intuitive Design", desc: "Simple and easy to use interface that requires no learning curve" }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col gap-3 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl group transition duration-200 hover:border-brand">
                            <div className="m-auto sm:m-0 bg-secondary-brand p-3 w-fit rounded-lg group-hover:bg-brand/10 transition duration-200">
                                <Zap className="text-brand w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-xl">{feature.title}</h4>
                            <p className="text-gray-brand">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

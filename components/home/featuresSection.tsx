import { Zap } from "lucide-react";

const FeaturesSection = () => {
    return (
        <section className="py-25 border-b-1">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-20">
                    <h1 className="mb-3 text-3xl md:text-[40px] text-center font-bold">
                        Everything you need to stay productive
                    </h1>
                    <p className="text-center font-medium text-[20px] text-gray-brand">
                        Powerful features designed to help you and your team
                        accomplish more
                    </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 text-center sm:text-start">
                    <div className="flex flex-col gap-3 border-1 border-gray-800 p-6 rounded-2xl group transition duration-200 hover:border-[#0a362d]">
                        <div className="m-auto sm:m-0 bg-secondary-brand p-3 w-fit rounded-lg group-hover:bg-[#0a362d] transition duration-200">
                            <Zap className="text-brand  w-6 h-6" />
                        </div>

                        <h4 className="font-bold text-xl ">Lightning Fast</h4>
                        <p className="text-gray-brand">
                            Blazing fast performance with real-time updates
                            across all your devices
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 border-1 border-gray-800 p-6 rounded-2xl group transition duration-200 hover:border-[#0a362d]">
                        <div className="m-auto sm:m-0  bg-secondary-brand p-3 w-fit rounded-lg group-hover:bg-[#0a362d] transition duration-200">
                            <Zap className="text-brand  w-6 h-6" />
                        </div>

                        <h4 className="font-bold text-xl ">Lightning Fast</h4>
                        <p className="text-gray-brand">
                            Blazing fast performance with real-time updates
                            across all your devices
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 border-1 border-gray-800 p-6 rounded-2xl group transition duration-200 hover:border-[#0a362d]">
                        <div className="m-auto sm:m-0  bg-secondary-brand p-3 w-fit rounded-lg group-hover:bg-[#0a362d] transition duration-200">
                            <Zap className="text-brand  w-6 h-6" />
                        </div>

                        <h4 className="font-bold text-xl ">Lightning Fast</h4>
                        <p className="text-gray-brand">
                            Blazing fast performance with real-time updates
                            across all your devices
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 border-1 border-gray-800 p-6 rounded-2xl group transition duration-200 hover:border-[#0a362d]">
                        <div className="m-auto sm:m-0  bg-secondary-brand p-3 w-fit rounded-lg group-hover:bg-[#0a362d] transition duration-200">
                            <Zap className="text-brand  w-6 h-6" />
                        </div>

                        <h4 className="font-bold text-xl ">Lightning Fast</h4>
                        <p className="text-gray-brand">
                            Blazing fast performance with real-time updates
                            across all your devices
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

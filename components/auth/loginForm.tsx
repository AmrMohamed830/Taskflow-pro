import { Lock, Mail, SquareCheckBig } from "lucide-react";
import Link from "next/link";

const LoginForm = () => {
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-[450px] mx-auto px-6 py-8 flex flex-col gap-4 bg-secondary-brand/40 border-gray-brand/20 border-1 rounded-md ">
                <div className="flex items-center gap-3 m-auto ">
                    <SquareCheckBig className="w-6 h-6 text-brand" />
                    <h1 className="text-[22px] font-bold">TaskFlow</h1>
                </div>
                <div className="text-center">
                    <h2 className="text-[27px] font-bold mt-2">Welcome back</h2>
                    <p className="text-gray-brand text-[14px]">
                        Sign in to your account to continue
                    </p>
                </div>
                <form className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-bold">
                            Email
                        </label>
                        <div className="relative bg-secondary-brand/70">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full py-1 pl-10 rounded-sm border-gray-brand/30 border-1 outline-none focus:ring-brand/40  focus:ring-3  focus:border-brand"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-bold">
                            Password
                        </label>
                        <div className="relative bg-secondary-brand/70">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            <input
                                type="password"
                                placeholder="Create a password"
                                className="w-full py-1 pl-10 rounded-sm border-gray-brand/30 border-1 outline-none focus:ring-brand/40  focus:ring-3  focus:border-brand"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-brand w-full py-1 rounded text-background hover:bg-brand/90 transition duration-200"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-[1px] bg-gray-800" />

                    <span className="text-sm text-gray-brand">
                        Or continue with
                    </span>

                    <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="text-center text-gray-brand">
                    Don't have an account?{" "}
                    <Link href="/register">
                        <span className="text-brand hover:text-brand/80 transition duration-200">
                            Sign up
                        </span>{" "}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

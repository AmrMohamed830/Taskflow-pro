"use client";
import { Lock, Mail, SquareCheckBig } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import type { LoginFormData } from "@/lib/types/auth";
import { loginUser, getMe } from "@/lib/api/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";

const LoginForm = () => {
    const [apiError, setApiError] = useState("");
    const router = useRouter();
    const { setUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        mode: "onChange",
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await loginUser(data);

            Cookies.set("token", result.token, {
                expires: 7,
            });

            // Fetch full user data after login to get the image and other details
            const userData = (await getMe()) as {
                data: {
                    name: string;
                    email: string;
                    image?: string;
                };
            };

            setUser({
                name: userData.data.name,
                email: userData.data.email,
                image: userData.data.image || "",
                role: "ADMIN",
            });

            console.log("Login Success");
            router.push("/dashboard");
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError("Something went wrong");
            }
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-[450px] mx-auto px-6 py-8 flex flex-col gap-4 bg-secondary-brand/40 border-gray-brand/20 border-1 rounded-md ">
                <div className="flex items-center gap-3 m-auto ">
                    <SquareCheckBig className="w-6 h-6 text-brand" />
                    <Link href="/">
                        <span className="text-[22px] font-bold">TaskFlow</span>
                    </Link>
                </div>
                <div className="text-center">
                    <h2 className="text-[27px] font-bold mt-2">Welcome back</h2>
                    <p className="text-gray-brand text-[14px]">
                        Sign in to your account to continue
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-bold">
                            Email
                        </label>
                        <div className="relative bg-secondary-brand/70">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register("email")}
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
                                {...register("password")}
                                type="password"
                                placeholder="Create a password"
                                className="w-full py-1 pl-10 rounded-sm border-gray-brand/30 border-1 outline-none focus:ring-brand/40  focus:ring-3  focus:border-brand"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="bg-brand w-full py-1 rounded text-background hover:bg-brand/90 transition duration-200"
                        >
                            {isSubmitting ? "Loading..." : "Sign in"}
                        </button>
                    </div>
                </form>
                {apiError && (
                    <p className="text-red-500 text-sm text-center">
                        {apiError}
                    </p>
                )}
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-[1px] bg-gray-800" />

                    <span className="text-sm text-gray-brand">
                        Or continue with
                    </span>

                    <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {/* Google */}
                    <button
                        type="button"
                        onClick={() =>
                            signIn("google", { callbackUrl: "/dashboard" })
                        }
                        className="flex items-center justify-center gap-2 border border-gray-700 rounded-md py-2 hover:bg-white/5 transition"
                    >
                        <Image
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                        />
                        <span className="text-sm">Google</span>
                    </button>

                    {/* GitHub */}
                    <button
                        type="button"
                        onClick={() =>
                            signIn("github", { callbackUrl: "/dashboard" })
                        }
                        className="flex items-center justify-center gap-2 border border-gray-700 rounded-md py-2 hover:bg-white/5 transition"
                    >
                        <Image
                            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            className="w-5 h-5"
                            width={20}
                            height={20}
                            alt="github"
                        />
                        <span className="text-sm">GitHub</span>
                    </button>
                </div>
                <div className="text-center text-gray-brand">
                    Dont have an account?{" "}
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

"use client";

import { Lock, Mail, SquareCheckBig, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { registerSchema } from "@/lib/validations/auth";

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting, isDirty, isSubmitted },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        reValidateMode: "onBlur",
    });
    const onSubmit = (data: RegisterFormData) => {
        console.log(data);
    };
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="max-w-[450px] mx-auto px-6 py-8 flex flex-col gap-4 bg-secondary-brand/40 border-gray-brand/20 border-1 rounded-md ">
                <div className="flex items-center gap-3 m-auto ">
                    <SquareCheckBig className="w-6 h-6 text-brand" />
                    <Link href="/">
                        <span className="text-[22px] font-bold">TaskFlow</span>
                    </Link>
                </div>
                <div className="text-center">
                    <h2 className="text-[27px] font-bold mt-2">
                        Create an account
                    </h2>
                    <p className="text-gray-brand text-[14px]">
                        Get started with TaskFlow today
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-bold">
                            Full Name
                        </label>
                        <div className="relative bg-secondary-brand/70">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Amr Mohammed Amin"
                                className={`w-full py-1 pl-10 rounded-sm border outline-none 
${
    isSubmitted && errors.name
        ? "border-red-500 focus:ring-red-400 focus:ring-1"
        : "border-gray-brand/30 focus:ring-brand/40 focus:border-brand focus:ring-3"
}`}
                            />
                        </div>
                    </div>
                    {isSubmitted && errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name.message}
                        </p>
                    )}
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
                                className={`w-full py-1 pl-10 rounded-sm border outline-none 
${
    isSubmitted && errors.email
        ? "border-red-500 focus:ring-red-400 focus:ring-1"
        : "border-gray-brand/30 focus:ring-brand/40 focus:border-brand focus:ring-3"
}`}
                            />
                        </div>
                    </div>
                    {isSubmitted && errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}
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
                                className={`w-full py-1 pl-10 rounded-sm border outline-none 
${
    isSubmitted && errors.password
        ? "border-red-500 focus:ring-red-400 focus:ring-1"
        : "border-gray-brand/30 focus:ring-brand/40 focus:border-brand focus:ring-3"
}`}
                            />
                        </div>
                    </div>
                    {isSubmitted && errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password.message}
                        </p>
                    )}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-bold">
                            Confirm Password
                        </label>
                        <div className="relative bg-secondary-brand/70">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Confirm your password"
                                className={`w-full py-1 pl-10 rounded-sm border outline-none 
${
    isSubmitted && errors.confirmPassword
        ? "border-red-500 focus:ring-red-400 focus:ring-1"
        : "border-gray-brand/30 focus:ring-brand/40 focus:border-brand focus:ring-3"
}`}
                            />
                        </div>
                    </div>
                    {isSubmitted && errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                    <div>
                        <button
                            type="submit"
                            // disabled={(!isValid && isDirty) || isSubmitting}
                            className="bg-brand w-full py-2 rounded text-background hover:bg-brand/90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Loading..." : "Sign up"}
                        </button>
                    </div>
                </form>

                <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-[1px] bg-gray-800" />
                    <span className="text-sm text-gray-brand">
                        Or register with
                    </span>
                    <div className="flex-1 h-px bg-gray-800" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
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

                    <button
                        type="button"
                        onClick={() => signIn("github")}
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

                <div>
                    <p className="text-center text-[13px] text-gray-brand">
                        By creating an account, you agree to our{" "}
                        <span className="text-brand">Terms of Service </span>
                        and <span className="text-brand">Privacy Policy </span>
                    </p>
                </div>
                <div className="text-center text-gray-brand">
                    Already have an account?{" "}
                    <Link href="/login">
                        <span className="text-brand hover:text-brand/80 transition duration-200">
                            Sign in
                        </span>{" "}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;

import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    token: string;
    data: {
        id: string;
        name: string;
        role: string;
    };
};
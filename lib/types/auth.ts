import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin";
        avatar?: string;
        department?: string;
        isActive?: boolean;
        lastLogin?: string;
        createdAt?: string;
        updatedAt?: string;
    };
};

export type ChangePasswordFormData = {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

export type ChangePasswordResponse = {
    success: boolean;
    message: string;
};
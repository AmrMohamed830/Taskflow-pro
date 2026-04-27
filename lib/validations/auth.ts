import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters"),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        confirmPassword: z
            .string()
            .min(6, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // 👈 مهم جدًا
    });
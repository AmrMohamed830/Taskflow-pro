import type { LoginResponse, RegisterFormData, LoginFormData } from "../types/auth";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// دالة مساعدة للتعامل مع الـ Logout التلقائي
const handleAuthFailure = (message: string) => {
    Cookies.remove("token"); // التأكد من مسح الـ Token يدوياً
    useAuthStore.getState().logout(); // تحديث حالة المتجر
    throw new Error(message);
};

export const registerUser = async (data: RegisterFormData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result?.error?.message || "Registration failed");
    return result;
};

export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            identifier: data.email,
            password: data.password,
        }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result?.error?.message || "Login failed");
    return result;
};

export const getMe = async () => {
    const token = Cookies.get("token");

    if (!token) {
        handleAuthFailure("No token found");
    }

    try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            handleAuthFailure(
                data?.message || data?.error?.message || "Session expired"
            );
        }

        return data;
    } catch (error) {
        handleAuthFailure("Network error - logged out");
    }
};

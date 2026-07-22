import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
    params?: Record<string, string | number | boolean | undefined>;
};

async function apiRequest<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const token = Cookies.get("token");
    
    // تجهيز الـ Headers
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // تجهيز الـ URL مع الـ Query Params إن وجدت
    let url = `${BASE_URL}${endpoint}`;
    if (options.params) {
        const searchParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        url += `?${searchParams.toString()}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            // إذا انتهت صلاحية التوكن (401)
            if (response.status === 401) {
                Cookies.remove("token");
                useAuthStore.getState().logout();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
            throw new Error(
                data?.message || 
                (typeof data?.error === "string" ? data.error : data?.error?.message) || 
                "Something went wrong"
            );
        }

        return data;
    } catch (error: unknown) {
        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: FetchOptions) => 
        apiRequest<T>(endpoint, { ...options, method: "GET" }),
    
    post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) => 
        apiRequest<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
    
    put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) => 
        apiRequest<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
    
    delete: <T>(endpoint: string, options?: FetchOptions) => 
        apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
    patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiRequest<T>(endpoint, {...options,method: "PATCH",body: JSON.stringify(body),}),
};

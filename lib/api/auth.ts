import type { LoginResponse, RegisterFormData, LoginFormData } from "../types/auth";
import { api } from "./client";

export const registerUser = async (data: RegisterFormData) => {
    return api.post("/auth/register", data);
};

export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", {
        identifier: data.email,
        password: data.password,
    });
};

export const getMe = async () => {
    return api.get("/auth/me");
};

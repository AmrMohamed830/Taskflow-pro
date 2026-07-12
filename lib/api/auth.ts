import type { LoginResponse, RegisterFormData, LoginFormData } from "../types/auth";
import { api } from "./client";

export const registerUser = async (
    data: RegisterFormData
): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/register", data);
};
export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", {
        email: data.email,
        password: data.password,
    });
};

export const logoutUser = async () => {
    return api.post("/auth/logout");
};

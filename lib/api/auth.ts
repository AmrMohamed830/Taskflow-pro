import type { LoginResponse, RegisterFormData, LoginFormData, ChangePasswordFormData, ChangePasswordResponse } from "../types/auth";
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

export const changePassword = async (
    data: ChangePasswordFormData
): Promise<ChangePasswordResponse> => {
    return api.post<ChangePasswordResponse>("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
    });
};

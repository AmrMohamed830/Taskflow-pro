import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/auth";
import type { ChangePasswordFormData } from "../types/auth";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) => changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });
};

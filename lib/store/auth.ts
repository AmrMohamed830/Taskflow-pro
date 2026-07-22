import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import type { User } from "../types/users";


type AuthStore = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,

            setUser: (user) => set({ user }),

            logout: () => {
                Cookies.remove("token");
                set({ user: null });
            },
        }),
        {
            name: "taskflow-auth-storage",
        }
    )
);

// Custom hook to avoid Next.js hydration issues
export const useAuth = () => {
    const [user, setUserState] = useState<User | null>(null);
    const storeUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        setUserState(storeUser);
    }, [storeUser]);

    return { user, setUser, logout };
};
import { create } from "zustand";
import Cookies from "js-cookie";

type User = {
    name: string;
    email: string;
    image?: string;
};

type AuthStore = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void; // 👈 ضيفنا دي
};

export const useAuthStore = create<AuthStore>((set) => ({
            user: null,

            setUser: (user) => set({ user }),

            logout: () => {
                Cookies.remove("token");
                set({ user: null });
            },
}));
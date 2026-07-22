import { create } from "zustand";

type FilterStore = {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  search: "",

  setSearch: (value) => set({ search: value }),

  clearSearch: () => set({ search: "" }),
}));

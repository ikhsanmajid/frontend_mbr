import { create } from "zustand"

type FilterState = {
    startDate: string | null;
    date1: Date | null;
    isLoading: boolean;
    setStartDate: (startDate: string | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setDate1: (date1: Date | null) => void;
};

export const useFilterState = create<FilterState>((set) => ({
    startDate: null,
    date1: null,
    isLoading: false,
    setStartDate: (startDate) => set({ startDate }),
    setDate1: (date1) => set({ date1 }),
    setIsLoading: (isLoading) => set({ isLoading }),
}))
import { create } from "zustand"

type FilterState = {
    startDate: string | null;
    endDate: string | null;
    date1: Date | null;
    date2: Date | null;
    setStartDate: (startDate: string | null) => void;
    setEndDate: (endDate: string | null) => void;
    setDate1: (date1: Date | null) => void;
    setDate2: (date2: Date | null) => void;
};

export const useFilterState = create<FilterState>((set) => ({
    startDate: null,
    endDate: null,
    date1: null,
    date2: null,
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setDate1: (date1) => set({ date1 }),
    setDate2: (date2) => set({ date2 }),
}))
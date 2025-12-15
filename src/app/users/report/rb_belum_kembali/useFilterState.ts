import { create } from "zustand"

type FilterState = {
    startDate: string | null;
    endDate: string | null;
    idProduk: number | null;
    statusKembali: "all" | "belum";
    date1: Date | null;
    date2: Date | null;
    includeUnConfirmed: boolean;
    setStartDate: (startDate: string | null) => void;
    setEndDate: (endDate: string | null) => void;
    setIdProduk: (idProduk: number | null) => void;
    setStatusKembali: (statusKembali: "all" | "belum") => void;
    setDate1: (date1: Date | null) => void;
    setDate2: (date2: Date | null) => void;
    setIncludeUnConfirmed: (includeUnConfirmed: boolean) => void;
};

export const useFilterState = create<FilterState>((set) => ({
    startDate: null,
    endDate: null,
    idProduk: null,
    statusKembali: "all",
    date1: null,
    date2: null,
    includeUnConfirmed: false,
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setIdProduk: (idProduk) => set({ idProduk }),
    setStatusKembali: (statusKembali) => set({ statusKembali }),
    setDate1: (date1) => set({ date1 }),
    setDate2: (date2) => set({ date2 }),
    setIncludeUnConfirmed: (includeUnConfirmed) => set({ includeUnConfirmed }),
}))
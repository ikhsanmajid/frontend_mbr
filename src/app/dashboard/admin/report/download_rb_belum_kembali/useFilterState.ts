import { create } from "zustand"

type FilterState = {
    startDate: string | null;
    endDate: string | null;
    idProduk: number | null;
    idBagian: number | null;
    statusKembali: "all" | "belum";
    date1: Date | null;
    date2: Date | null;
    setStartDate: (startDate: string | null) => void;
    setEndDate: (endDate: string | null) => void;
    setIdProduk: (idProduk: number | null) => void;
    setIdBagian: (idBagian: number | null) => void;
    setStatusKembali: (statusKembali: "all" | "belum") => void;
    setDate1: (date1: Date | null) => void;
    setDate2: (date2: Date | null) => void;
};

export const useFilterState = create<FilterState>((set) => ({
    startDate: null,
    endDate: null,
    idProduk: null,
    idBagian: null,
    statusKembali: "all",
    date1: null,
    date2: null,
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setIdProduk: (idProduk) => set({ idProduk }),
    setIdBagian: (idBagian) => set({ idBagian }),
    setStatusKembali: (statusKembali) => set({ statusKembali }),
    setDate1: (date1) => set({ date1 }),
    setDate2: (date2) => set({ date2 }),
}))
import { create } from "zustand"

type FilterState = {
    idProduk: number | null;
    NIKNama: string | null;
    StatusKonfirmasi: "all" | "onlyConfirmed" | "onlyPending" | "onlyRejected";
    StatusDipakai: "all" | "onlyUsed" | "onlyAvailable";
    setIdProduk: (idProduk: number | null) => void;
    setNIKNama: (NIKNama: string) => void;
    setStatusKonfirmasi: (StatusKonfirmasi: "all" | "onlyConfirmed" | "onlyPending" | "onlyRejected") => void;
    setStatusDipakai: (StatusDipakai: "all" | "onlyUsed" | "onlyAvailable") => void;    
};

export const useFilterState = create<FilterState>((set) => ({
    idProduk: null,
    NIKNama: null,
    StatusKonfirmasi: "all",
    StatusDipakai: "all",
    setIdProduk: (idProduk) => set({ idProduk }),
    setNIKNama: (NIKNama) => set({ NIKNama }),
    setStatusKonfirmasi: (StatusKonfirmasi) => set({ StatusKonfirmasi }),
    setStatusDipakai: (StatusDipakai) => set({ StatusDipakai }),    
}))
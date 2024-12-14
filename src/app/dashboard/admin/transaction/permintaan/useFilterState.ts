import { create } from "zustand"

type FilterState = {
    idProduk: number | null;
    filterYear: number | null;
    idBagian: number | null;
    NIKNama: string | null;
    StatusKonfirmasi: "all" | "onlyConfirmed" | "onlyPending" | "onlyRejected";
    StatusDipakai: "all" | "onlyUsed" | "onlyAvailable";
    setIdProduk: (idProduk: number | null) => void;
    setFilterYear: (filterYear: number | null) => void;
    setIdBagian: (idBagian: number | null) => void;
    setNIKNama: (NIKNama: string) => void;
    setStatusKonfirmasi: (StatusKonfirmasi: "all" | "onlyConfirmed" | "onlyPending" | "onlyRejected") => void;
    setStatusDipakai: (StatusDipakai: "all" | "onlyUsed" | "onlyAvailable") => void;    
};

export const useFilterState = create<FilterState>((set) => ({
    idProduk: null,
    filterYear: null,
    idBagian: null,
    NIKNama: null,
    StatusKonfirmasi: "all",
    StatusDipakai: "all",
    setIdProduk: (idProduk) => set({ idProduk }),
    setFilterYear: (filterYear) => set({ filterYear }),
    setIdBagian: (idBagian) => set({ idBagian }),
    setNIKNama: (NIKNama) => set({ NIKNama }),
    setStatusKonfirmasi: (StatusKonfirmasi) => set({ StatusKonfirmasi }),
    setStatusDipakai: (StatusDipakai) => set({ StatusDipakai }),    
}))
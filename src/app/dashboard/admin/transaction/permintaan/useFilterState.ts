import { create } from "zustand"

type FilterState = {
    idTransaksi: number | null;
    idProduk: number | null;
    filterYear: number | null;
    idBagian: number | null;
    NIKNama: string | null;
    StatusKonfirmasi: "all" | "onlyConfirmed" | "onlyPending" | "onlyRejected";
    StatusDipakai: "all" | "onlyUsed" | "onlyAvailable";
    setIdTransaksi: (idTransaksi: number | null) => void;
    setIdProduk: (idProduk: number | null) => void;
    setFilterYear: (filterYear: number | null) => void;
    setIdBagian: (idBagian: number | null) => void;
    setNIKNama: (NIKNama: string) => void;
    setStatusKonfirmasi: (StatusKonfirmasi: "all" | "onlyConfirmed" | "onlyPending" | "onlyRejected") => void;
    setStatusDipakai: (StatusDipakai: "all" | "onlyUsed" | "onlyAvailable") => void;    
};

export const useFilterState = create<FilterState>((set) => ({
    idTransaksi: null,
    idProduk: null,
    filterYear: null,
    idBagian: null,
    NIKNama: null,
    StatusKonfirmasi: "onlyPending",
    StatusDipakai: "all",
    setIdTransaksi: (idTransaksi) => set({ idTransaksi }),
    setIdProduk: (idProduk) => set({ idProduk }),
    setFilterYear: (filterYear) => set({ filterYear }),
    setIdBagian: (idBagian) => set({ idBagian }),
    setNIKNama: (NIKNama) => set({ NIKNama }),
    setStatusKonfirmasi: (StatusKonfirmasi) => set({ StatusKonfirmasi }),
    setStatusDipakai: (StatusDipakai) => set({ StatusDipakai }),    
}))
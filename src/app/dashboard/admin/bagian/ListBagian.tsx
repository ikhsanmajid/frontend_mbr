"use client";
import { useState } from 'react';
import BagianTable from "@/app/dashboard/admin/bagian/BagianTable";
import ModalAdd from "./ModalAdd";

export interface IBagian {
    id?: number;
    namaBagian?: string;
    isActive?: boolean;
    idJenisBagian?: number;
    namaJenisBagian?: string;
}

export default function ListBagian() {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateBagian, setMutateBagian] = useState<{mutate: null | VoidFunction}>({mutate: null});

    return (
        <>
            <BagianTable
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateBagian({mutate: mutate})}                
            />

            <ModalAdd
                show={showModalAdd}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateBagian.mutate}
            />
        </>
    );
}

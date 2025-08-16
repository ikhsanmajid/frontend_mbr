"use client";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import BagianTable from "@/app/dashboard/admin/bagian/BagianTable";
import ModalAdd from "./ModalAdd";

export interface IBagian {
    id?: number;
    namaBagian?: string;
    isActive?: boolean;
    idJenisBagian?: number;
    namaJenisBagian?: string;
}

export default function ListBagian({ session }: { session: string }) {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateBagian, setMutateBagian] = useState<{mutate: null | VoidFunction}>({mutate: null});

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <BagianTable
                session={session}
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateBagian({mutate: mutate})}                
            />

            <ModalAdd
                show={showModalAdd}
                session={session}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateBagian.mutate}
            />
            <ToastContainer/>       
        </>
    );
}

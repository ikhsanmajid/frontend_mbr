"use client";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import BagianTable from "@/app/dashboard/admin/bagian/BagianTable";
import ModalAdd from "./ModalAdd";
import React from "react";

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
            <Toaster />          
        </>
    );
}

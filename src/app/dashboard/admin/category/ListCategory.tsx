"use client";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import CategoryTable from "./CategoryTable";
import ModalAdd from "./ModalAdd";
import React from "react";

export interface ICategory {
    id?: string | number;
    namaKategori?: string;
    startingNumber?: string;
}

export default function ListCategory({ session }: { session: string }) {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateBagian, setMutateBagian] = useState<{ mutate: null | VoidFunction }>({ mutate: null });

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <CategoryTable
                session={session}
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateBagian({ mutate: mutate })}
            />

            <ModalAdd
                show={showModalAdd}
                session={session}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateBagian.mutate}
            />

            <Toaster/>
        </>
    );
}

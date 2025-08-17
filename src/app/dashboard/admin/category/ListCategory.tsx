"use client";
import { useState } from "react";
import CategoryTable from "./CategoryTable";
import ModalAdd from "./ModalAdd";
import React from "react";

export interface ICategory {
    id?: string | number;
    namaKategori?: string;
    startingNumber?: string;
}

export default function ListCategory() {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateBagian, setMutateBagian] = useState<{ mutate: null | VoidFunction }>({ mutate: null });

    return (
        <>
            <CategoryTable
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateBagian({ mutate: mutate })}
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

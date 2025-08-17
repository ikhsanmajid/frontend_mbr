"use client";
import { useState } from "react";
import ModalAdd from "./ModalAdd";
import BagianJabatanTable from "./BagianJabatanTable";

export function ListBagianJabatan() {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateBagianJabatan, setMutateBagianJabatan] = useState<{mutate: null | VoidFunction}>({mutate: null});

    return (
        <>
            <BagianJabatanTable
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutateFn: VoidFunction) => setMutateBagianJabatan({mutate: mutateFn})}                
            />

            <ModalAdd
                show={showModalAdd}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateBagianJabatan.mutate}
            />
        </>
    );
}

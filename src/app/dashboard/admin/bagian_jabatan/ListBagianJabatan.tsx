"use client";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import ModalAdd from "./ModalAdd";
import BagianJabatanTable from "./BagianJabatanTable";

export function ListBagianJabatan({ session }: { session: string }) {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateBagianJabatan, setMutateBagianJabatan] = useState<{mutate: null | VoidFunction}>({mutate: null});

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <BagianJabatanTable
                session={session}
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutateFn: VoidFunction) => setMutateBagianJabatan({mutate: mutateFn})}                
            />

            <ModalAdd
                show={showModalAdd}
                session={session}
                onClose={() => {
                    setShowModalAdd(false)
                    toast.dismiss()
                }}
                mutate={mutateBagianJabatan.mutate}
            />
        </>
    );
}

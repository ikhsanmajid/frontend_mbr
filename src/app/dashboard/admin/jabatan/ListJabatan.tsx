"use client";
import { useState, useEffect } from "react";
import ModalAdd from "@/app/dashboard/admin/jabatan/ModalAdd";
import JabatanTable from "@/app/dashboard/admin/jabatan/JabatanTable";
import { ToastContainer, toast } from 'react-toastify'


export type JabatanType = {
    id?: number,
    namaJabatan?: string,
    isActive?: boolean
}

export function ListJabatan({ session }: { session: string }) {
    // Add Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateJabatan, setMutateJabatan] = useState<{mutate: null | VoidFunction}>({mutate: null});

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <JabatanTable
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateJabatan({mutate: mutate})}
            />

            <ModalAdd
                show={showModalAdd}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateJabatan.mutate}
            />
            <ToastContainer/>
        </>
    );
}

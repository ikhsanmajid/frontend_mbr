"use client";
import { useState, useEffect } from "react";
import ModalAdd from "@/app/dashboard/admin/jabatan/ModalAdd";
import JabatanTable from "@/app/dashboard/admin/jabatan/JabatanTable";
import toast from "react-hot-toast";


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
                session={session}
                onAdd={(state) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateJabatan({mutate: mutate})}
            />

            <ModalAdd
                show={showModalAdd}
                session={session}
                onClose={() => {
                    setShowModalAdd(false)
                    toast.dismiss()
                }}
                mutate={mutateJabatan.mutate}
            />
        </>
    );
}

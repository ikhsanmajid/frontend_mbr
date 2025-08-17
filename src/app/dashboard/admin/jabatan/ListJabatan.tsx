"use client";
import { useState } from "react";
import JabatanTable from "@/app/dashboard/admin/jabatan/JabatanTable";
import ModalAdd from "@/app/dashboard/admin/jabatan/ModalAdd";


export type JabatanType = {
    id?: number,
    namaJabatan?: string,
    isActive?: boolean
}

export function ListJabatan() {
    // Add Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateJabatan, setMutateJabatan] = useState<{mutate: null | VoidFunction}>({mutate: null});

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
        </>
    );
}

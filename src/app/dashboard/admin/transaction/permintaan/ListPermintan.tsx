"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PermintaanTable from "./PermintaanTable";

export default function ListPermintaan({ session }: { session: string }) {
    // Add Data
    const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
    const [mutateProduct, setMutateProduct] = useState<{mutate: null | VoidFunction}>({mutate: null});

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <PermintaanTable
                session={session}
            />
        </>
    );
}

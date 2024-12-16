"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import PermintaanTable from "./PermintaanTable";

export default function ListPermintaan({ session }: { session: string }) {
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

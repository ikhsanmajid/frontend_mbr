"use client"
import { ToastContainer, toast } from 'react-toastify'
import { useState, useEffect } from "react";
import ModalAdd from "@/app/dashboard/admin/users/ModalAdd";
import UserTable from "@/app/dashboard/admin/users/UserTable";
import React from "react";

export interface IUser {
    id?: number;
    nik?: number;
    nama?: string;
    email?: string;
    isActive?: boolean;
    isAdmin?: boolean;
}

export default function ListUsers({ session }: { session: string }) {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateUsers, setMutateUsers] = useState<{ mutate: null | VoidFunction }>({ mutate: null });

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <UserTable
                session={session}
                mutateUsers={(mutate: VoidFunction) => setMutateUsers({ mutate: mutate })}
                onAdd={(state) => setShowModalAdd(state)}
            >
            </UserTable>


            <ModalAdd
                show={showModalAdd}
                session={session}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateUsers.mutate}
            />

            <ToastContainer/>
        </>
    )

}
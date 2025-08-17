"use client"
import { useState } from "react";
import ModalAdd from "@/app/dashboard/admin/users/ModalAdd";
import React from "react";
import UserTable from "@/app/dashboard/admin/users/UserTable";

export interface IUser {
    id?: number;
    nik?: number;
    nama?: string;
    email?: string;
    isActive?: boolean;
    isAdmin?: boolean;
}

export default function ListUsers() {
    // Menampilkan Modal Tambah Data
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [mutateUsers, setMutateUsers] = useState<{ mutate: null | VoidFunction }>({ mutate: null });

    return (
        <>
            <UserTable
                mutateUsers={(mutate: VoidFunction) => setMutateUsers({ mutate: mutate })}
                onAdd={(state) => setShowModalAdd(state)}
            >
            </UserTable>


            <ModalAdd
                show={showModalAdd}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateUsers.mutate}
            />

        </>
    )

}
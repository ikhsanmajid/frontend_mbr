"use client";
import { useState, useEffect } from "react";
import ModalAdd from "./ModalAdd";
import { toast } from 'react-toastify'
import ProductTable from "./ProductTable";


export interface IProduct {
    id: number;
    namaProduk: string;
    idBagian: number;
    namaBagian: string;
    idKategori: number;
    namaKategori: string;
    isActive: boolean;
}

export default function ListProduct({ session }: { session: string }) {
    // Add Data
    const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
    const [mutateProduct, setMutateProduct] = useState<{mutate: null | VoidFunction}>({mutate: null});

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <>
            <ProductTable
                session={session}
                onAdd={(state: boolean) => setShowModalAdd(state)}
                mutate={(mutate: VoidFunction) => setMutateProduct({mutate: mutate})}
            />

            <ModalAdd
                show={showModalAdd}
                session={session}
                onClose={() => {
                    setShowModalAdd(false)
                    toast.dismiss()
                }}
                mutate={mutateProduct.mutate}
            />
        </>
    );
}

"use client";
import { useState, useEffect } from "react";
import ModalAdd from "./ModalAdd";
import { toast } from 'react-toastify'
import ProductTable from "./ProductTable";
import ModalAddWithCSV from "./ModalAddWithCSV";


export interface IProduct {
    id: number;
    namaProduk: string;
    idBagian: number;
    namaBagian: string;
    idKategori: number;
    namaKategori: string;
    isActive: boolean;
}

export default function ListProduct() {
    // Add Data
    const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
    const [showModalAddWithCSV, setShowModalAddWithCSV] = useState<boolean>(false);
    const [mutateProduct, setMutateProduct] = useState<{ mutate: null | VoidFunction }>({ mutate: null });

    return (
        <>
            <ProductTable
                onAdd={(state: boolean) => setShowModalAdd(state)}
                onAddCSV={(state: boolean) => setShowModalAddWithCSV(state)}
                mutate={(mutate: VoidFunction) => setMutateProduct({ mutate: mutate })}
            />

            <ModalAdd
                show={showModalAdd}
                onClose={() => {
                    setShowModalAdd(false)
                }}
                mutate={mutateProduct.mutate}
            />

            <ModalAddWithCSV
                show={showModalAddWithCSV}
                onClose={() => {
                    setShowModalAddWithCSV(false)
                }}
                mutate={mutateProduct.mutate}
            />
        </>
    );
}

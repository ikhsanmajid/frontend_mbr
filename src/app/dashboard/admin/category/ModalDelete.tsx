import { deleteCategory } from "@/app/lib/admin/users/userAPIRequest";
import { ICategory } from "./ListCategory";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify'
import { useState } from "react";
import React from "react";

export default function ModalDelete({ show, deleteData, onClose, kategoriMutate }: { show: boolean, deleteData: ICategory | null, onClose: () => void, kategoriMutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const kategoriDelete = await deleteCategory(deleteData);
        setIsLoadingDelete(false);

        if (kategoriDelete.type !== "error") {
            onClose()
            toast.success("Kategori Berhasil Dihapus");
            kategoriMutate();
        } else {
            toast.error("Kategori Gagal Dihapus");
        }
    }
    
    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus Kategori</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin menghapus {deleteData && deleteData.namaKategori} ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>

                    {isLoadingDelete ?
                        <Button variant="danger" disabled={true}>
                            Loading...
                        </Button> :
                        <Button variant="danger" disabled={false} onClick={handleDelete}>
                            Delete
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}
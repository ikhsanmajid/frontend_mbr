import { IBagian } from "../bagian/ListBagian";
import { deleteBagian } from "@/app/lib/admin/users/userAPIRequest";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify'
import { useState } from "react";
import React from "react";

export default function ModalDelete({ show, deleteData, onClose, bagianMutate }: { show: boolean, deleteData: IBagian | null, onClose: () => void, bagianMutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const bagianDelete = await deleteBagian(deleteData);
        setIsLoadingDelete(false);

        if (bagianDelete.data) {
            onClose()
            toast.success("Bagian Berhasil Dihapus");
            bagianMutate();
        } else {
            toast.error("Bagian Gagal Dihapus");
        }
    }
    
    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin menghapus {deleteData && deleteData.namaBagian} ?</Modal.Body>
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
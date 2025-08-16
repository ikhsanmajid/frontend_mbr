import { Modal, Button } from "react-bootstrap"
import { useState } from "react";
import { deleteUser } from "@/app/lib/admin/users/userAPIRequest";
import { toast } from "react-toastify";
import React from "react";
import { IUser } from "./ListUsers";

export default function ModalDelete({show, session, deleteData, onClose, usersMutate}: { show: boolean, session: string, deleteData: IUser | null, onClose: () => void, usersMutate: () => void }){
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const userDelete = await deleteUser(deleteData, session);
        setIsLoadingDelete(false);

        if (userDelete.ok) {
            onClose()
            toast.success("User Berhasil Dihapus");
            usersMutate();
        } else {
            toast.error("User Gagal Dihapus");
        }
    }

    return (
        <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Apakah anda yakin ingin menghapus {deleteData && deleteData.email} ?</Modal.Body>
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
    )
}
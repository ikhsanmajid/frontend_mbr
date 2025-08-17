import { deleteUser } from "@/app/lib/admin/users/userAPIRequest";
import { IUser } from "./ListUsers";
import { Modal, Button } from "react-bootstrap"
import { toast } from "react-toastify";
import { useState } from "react";
import React from "react";

export default function ModalDelete({ show, deleteData, onClose, usersMutate }: { show: boolean, deleteData: IUser | null, onClose: () => void, usersMutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const userDelete = await deleteUser(deleteData);
        setIsLoadingDelete(false);

        if (userDelete.data.status == "success") {
            onClose()
            toast.success("User Berhasil Dihapus");
            usersMutate();
        } else {
            toast.error("User Gagal Dihapus");
        }
    }

    return (
        <>
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
        </>
    )
}
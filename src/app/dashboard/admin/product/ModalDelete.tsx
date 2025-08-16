import { deleteProduk } from "@/app/lib/admin/users/userAPIRequest";
import { Modal, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify'
import { useState } from "react";
import { IProduct } from "./ListProduct";

export default function ModalDelete({ show, session, deleteData, onClose, mutate }: { show: boolean, session: string, deleteData: IProduct | null, onClose: () => void, mutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const bagianDelete = await deleteProduk(deleteData, session);
        setIsLoadingDelete(false);

        if (bagianDelete.ok) {
            onClose()
            toast.success("Produk Berhasil Dihapus");
            mutate()!;
        } else {
            toast.error("Produk Gagal Dihapus");
        }
    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin menghapus {deleteData?.namaProduk} ?</Modal.Body>
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
            <ToastContainer/>
        </>
    )
}
import { deleteJabatan } from "@/app/lib/admin/users/userAPIRequest";
import { Modal, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify'
import { useState } from "react";
import { Jabatan } from "./JabatanTable";

export default function ModalDelete({ show, session, deleteData, onClose, mutate }: { show: boolean, session: string, deleteData: Jabatan | null, onClose: () => void, mutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const bagianDelete = await deleteJabatan(deleteData, session);
        setIsLoadingDelete(false);

        if (bagianDelete.ok) {
            onClose()
            toast.success("Jabatan Berhasil Dihapus");
            mutate();
        } else {
            toast.error("Jabatan Gagal Dihapus");
        }
    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin menghapus {deleteData?.namaJabatan} ?</Modal.Body>
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
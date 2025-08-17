import { deleteBagianJabatan } from "@/app/lib/admin/users/userAPIRequest";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify'
import { useState } from "react";
import { IBagianJabatan } from "./BagianJabatanTable";

export default function ModalDelete({ show, deleteData, onClose, mutate }: { show: boolean, deleteData: IBagianJabatan | null, onClose: () => void, mutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        setIsLoadingDelete(true);
        const bagianJabatanDelete = await deleteBagianJabatan(deleteData);
        setIsLoadingDelete(false);

        if (bagianJabatanDelete.data.data) {
            onClose()
            toast.success("Bagian vs Jabatan Berhasil Dihapus");
            mutate();
        } else {
            toast.error("Bagian vs Jabatan Gagal Dihapus");
        }
    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin menghapus {deleteData?.idBagianFK.namaBagian}-{deleteData?.idJabatanFK.namaJabatan}?</Modal.Body>
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
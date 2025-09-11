import { deleteTransaksi } from "@/app/lib/admin/users/userAPIRequest";
import { IPermintaan } from "./PermintaanTable";
import { Modal, Button } from "react-bootstrap"
import { toast } from "react-toastify";
import { useState } from "react";
import React from "react";

export default function ModalDelete({ show, deleteData, onClose, listMutate }: { show: boolean, deleteData: IPermintaan | null, onClose: () => void, listMutate: () => void }) {
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

    // Menangani fungsi delete data
    async function handleDelete() {
        try {
            setIsLoadingDelete(true);
            const trxDelete = await deleteTransaksi(deleteData);
            setIsLoadingDelete(false);

            if (trxDelete.data.status == "success") {
                listMutate();
                toast.success("Transaksi Berhasil Dihapus");
                onClose()
            }
        } catch (e) {
            toast.error("Transaksi Gagal Dihapus");
            setIsLoadingDelete(false);
        }
    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus Transaksi</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin menghapus transaksi {deleteData && deleteData.id} ?</Modal.Body>
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
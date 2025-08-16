import { Modal, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify'
import { useState } from "react"
import TableLihatNomor from "./TableLihatNomor"


export default function ModalLihat({ show, session, onClose, data }: { show: boolean, session: string, onClose: () => void, data: any | null }) {
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)


    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false} dialogClassName="modal-80w">
                <Modal.Header closeButton>
                    <Modal.Title>Pengembalian MBR</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="row mb-3">
                            <div className="col col-6">
                                <div className="row mb-1 align-items-center">
                                    <div className="col col-3">
                                        <span>Nama Produk: </span>
                                    </div>
                                    <div className="col col-9">
                                        {data?.namaProduk}
                                    </div>
                                </div>

                                <div className="row mb-1 align-items-center">
                                    <div className="col col-3">
                                        <span>No Dokumen MBR: </span>
                                    </div>
                                    <div className="col col-9">
                                        {data?.nomorMBR}
                                    </div>
                                </div>

                                <div className="row mb-1 align-items-center">
                                    <div className="col col-3">
                                        <span>No Awal - No Akhir: </span>
                                    </div>
                                    <div className="col col-9">
                                        {data?.nomorAwal} - {data?.nomorAkhir}
                                    </div>
                                </div>
                            </div>
                            <div className="col col-6">
                                <div className="row mb-1 align-items-center">
                                    <div className="col col-4">
                                        <span>Tipe MBR: </span>
                                    </div>
                                    <div className="col col-8">
                                        {data?.tipeMBR}
                                    </div>
                                </div>

                                <div className="row mb-1 align-items-center">
                                    <div className="col col-4">
                                        <span>Tanggal Pembuatan: </span>
                                    </div>
                                    <div className="col col-8">
                                        {data?.tanggalBulan}-{data?.tahun}
                                    </div>
                                </div>

                                <div className="row mb-1 align-items-center">
                                    <div className="col col-4">
                                        <span>Jumlah RB Belum Kembali: </span>
                                    </div>
                                    <div className="col col-8">
                                        {data?.RBBelumKembali}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <TableLihatNomor
                                session={session}
                                idData={data?.id}>

                            </TableLihatNomor>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>

                </Modal.Footer>

            </Modal >
            <ToastContainer/>
        </>
    )
}
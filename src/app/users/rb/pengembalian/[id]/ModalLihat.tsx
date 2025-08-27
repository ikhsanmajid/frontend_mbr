import { Modal, Button } from "react-bootstrap"
import { useState } from "react"
import TableLihatNomor from "./TableLihatNomor"


export default function ModalLihat({ show, onClose, data }: { show: boolean, onClose: () => void, data: any | null }) {
    return (
        <>
            <Modal show={show} onHide={onClose} size="xl" style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Pengembalian MBR</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Header Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0 fw-bold">Informasi Pengembalian</h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Nama Produk</small>
                                            <span className="fw-semibold">{data?.namaProduk}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">No Dokumen MBR</small>
                                            <span className="fw-semibold">{data?.nomorMBR}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">No Awal - No Akhir</small>
                                            <span className="fw-semibold">{data?.nomorAwal} - {data?.nomorAkhir}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Tipe MBR</small>
                                            <span className="fw-semibold">{data?.tipeMBR}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Tanggal Pembuatan</small>
                                            <span className="fw-semibold">{data?.tanggalBulan}-{data?.tahun}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Jumlah RB Belum Kembali</small>
                                            <span className="fw-semibold">{data?.RBBelumKembali}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Detail */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0 fw-bold">Detail Nomor RB</h6>
                        </div>
                        <div className="card-body p-0">
                            <TableLihatNomor idData={data?.id} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
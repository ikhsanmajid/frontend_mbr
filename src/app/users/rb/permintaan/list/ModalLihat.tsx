import { IPermintaan } from "./List";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { GetDetailPermintaan, GetDetailPermintaanNomor, usedPermintaanNomor } from "@/app/lib/admin/users/userAPIRequest";

import React from "react";

export default function ModalLihat({ session, data, show, onClose, onSave }: { session: string, data: IPermintaan | null, show: boolean, onClose: () => void, onSave: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan } = data?.status !== "DITERIMA" ? GetDetailPermintaan(session, data ? Number(data.id) : null) : { detailPermintaan: null, isLoadingPermintaan: false, error: null, mutateListPermintaan: null }
    const { detailPermintaanNomor, isLoadingPermintaanNomor, errorNomor, mutateListPermintaanNomor } = data?.status == "DITERIMA" ? GetDetailPermintaanNomor(session, data ? Number(data.id) : null) : { detailPermintaanNomor: null, isLoadingPermintaanNomor: false, errorNomor: null, mutateListPermintaanNomor: null }

    async function handleSudahDipakai() {
        setIsSubmitting(true);
        try {
            const response = await usedPermintaanNomor(Number(data?.id), session);
            if (response.status === "success") {
                toast.success("Berhasil menandai permintaan RB sudah dipakai.");
                onSave();
                setIsSubmitting(false);
            } else {
                toast.error("Gagal menambah permintaan RB.");
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat mengirim permintaan.");
            setIsSubmitting(false);
            //console.error("Error:", error);
        }
    }

    return (
        <>
            <Modal show={show} onHide={() => {
                onClose()
            }} dialogClassName="modal-80w" style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Permintaan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-2">
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">NIK Pembuat</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Nama Pembuat</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Bagian Pembuat</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Tanggal Permintaan</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Status</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.nikCreated}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.namaCreated}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.namaBagianCreated}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.timeCreated}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.status}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered align-middle text-center">
                            <thead>
                                <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Nama Produk</th>
                                    <th scope="col">No. MBR</th>
                                    <th scope="col">Tipe MBR</th>
                                    <th scope="col">Jumlah</th>
                                    {data?.status == "DITERIMA" &&
                                        <>
                                            <th scope="col">Nomor Awal</th>
                                            <th scope="col">Nomor Akhir</th>
                                        </>}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.status !== "DITERIMA" && !isLoadingPermintaan && detailPermintaan && detailPermintaan.data.map((item: any, produkIndex: number) => (
                                    item.items.map((produk: any, index: number) => (
                                        <tr key={index}>

                                            {index == 0 ?
                                                <>
                                                    <td rowSpan={item.items.length}>{produkIndex + 1}</td>
                                                    <td rowSpan={item.items.length}>{item.namaProduk}</td>
                                                </> : null}


                                            <td>{produk.nomorMBR}</td>
                                            <td>{produk.tipeMBR}</td>
                                            <td>{produk.jumlah}</td>
                                        </tr>
                                    ))
                                ))}

                                {data?.status === "DITERIMA" && !isLoadingPermintaanNomor && detailPermintaanNomor && detailPermintaanNomor.data.map((item: any, produkIndex: number) => (
                                    item.items.map((produk: any, index: number) => (
                                        <tr key={index}>

                                            {index == 0 ?
                                                <>
                                                    <td rowSpan={item.items.length}>{produkIndex + 1}</td>
                                                    <td rowSpan={item.items.length}>{item.namaProduk}</td>
                                                </> : null}


                                            <td>{produk.nomorMBR}</td>
                                            <td>{produk.tipeMBR}</td>
                                            <td>{produk.jumlah}</td>
                                            <td className="fw-bolder">{produk.nomorAwal}</td>
                                            <td className="fw-bolder">{produk.nomorAkhir}</td>
                                        </tr>
                                    ))
                                ))}

                                {(isLoadingPermintaan || isLoadingPermintaanNomor) && error &&
                                    <tr>
                                        <td colSpan={data?.status == "DITERIMA" ? 7 : 5} className="text-center">Loading....</td>
                                    </tr>
                                }

                                {(!isLoadingPermintaan || !isLoadingPermintaanNomor) && error &&
                                    <tr>
                                        <td colSpan={data?.status == "DITERIMA" ? 7 : 5} className="text-center">{error.message}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <br />

                    {data?.status == "PENDING" &&
                        <div className="row d-flex align-items-center">
                            <div className="col col-auto">
                                Keputusan:
                            </div>
                            <div className="col col-auto">
                                <input type="text" className="form-control" value="PENDING" disabled />
                            </div>
                        </div>
                    }

                    {(data?.status == "DITERIMA" || data?.status == "DITOLAK") &&
                        <div className="row d-flex align-items-center">
                            <div className="col col-auto">
                                Keputusan:
                            </div>
                            <div className="col col-auto">
                                <input type="text" className="form-control" value={data?.status} disabled />
                            </div>

                            <div className="col col-auto">
                                Dikonfirmasi Oleh:
                            </div>
                            <div className="col col-auto">
                                <input type="text" className="form-control" value={data?.namaConfirmed} disabled />
                            </div>
                            {data?.status == "DITOLAK" &&
                                <>
                                    <div className="col col-auto">
                                        Alasan Penolakan:
                                    </div>
                                    <div className="col col-auto">
                                        <textarea className="form-control" value={data?.reason} disabled />
                                    </div>
                                </>
                            }
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {data?.status === "DITERIMA" && Boolean(data.used) !== true && <Button variant="success" onClick={() => {
                        handleSudahDipakai()
                    }} disabled={isSubmitting}>
                        Tandai Sudah Dipakai
                    </Button>}
                    <Button variant="danger" onClick={() => {
                        onClose()
                    }} disabled={isSubmitting}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            <Toaster />
        </>
    )
}

import { IPermintaan } from "./PermintaanTable";
import { Modal, Button } from "react-bootstrap";
import { GetDetailPermintaan, GetDetailPermintaanNomor, confirmPermintaan } from "@/app/lib/admin/users/userAPIRequest";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { Toaster, toast } from "react-hot-toast";

export default function ModalLihat({ session, data, show, onClose, onSave }: { session: string, data: IPermintaan | null, show: boolean, onClose: () => void, onSave: (status: string) => void }) {
    const [keputusan, setKeputusan] = useState<string | null>(null)
    const keputusanRef = useRef<HTMLSelectElement | null>(null)
    const reasonRef = useRef<HTMLInputElement | null>(null)
    const [idData, setIdData] = useState<number | null>(null)

    useEffect(() => {
        if (data) {
            setIdData(data.id)
        }

    }, [data?.status, data?.id, data])

    const { detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan } = data?.status !== "DITERIMA" ? GetDetailPermintaan(session, data ? data.id : null) : { detailPermintaan: null, isLoadingPermintaan: false, error: null, mutateListPermintaan: null }
    const { detailPermintaanNomor, isLoadingPermintaanNomor, errorNomor, mutateListPermintaanNomor } = data?.status == "DITERIMA" ? GetDetailPermintaanNomor(session, data ? data.id : null) : { detailPermintaanNomor: null, isLoadingPermintaanNomor: false, errorNomor: null, mutateListPermintaanNomor: null }

    function checkReason() {
        if (keputusan == "2") {
            return reasonRef.current?.value == "" ? false : true
        }

        return true
    }

    async function handleSave() {
        if (!checkReason()) {
            toast.error("Alasan Penolakan Harus Diisi")
            return
        }

        let keputusanValue: "confirm" | "reject" = keputusanRef.current?.value == "1" ? "confirm" : "reject"
        const confirm = await confirmPermintaan(data, session, keputusanValue, reasonRef.current?.value)
        if ('data' in confirm!) {
            onSave(confirm.data.status)
            setKeputusan(null)
            onClose()
        } else {
            toast.error("Konfirmasi Gagal!")
        }
    }

    return (
        <>
            <Modal show={show} onHide={() => {
                onClose()
                setKeputusan(null)
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
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.createdNIK}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.createdBy}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.createdByBagian}</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">: {data?.createdAt}</label>
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
                                        <tr key={`${produkIndex}${index}`}>

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
                                        <tr key={`${produkIndex}${index}`}>

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
                                <select ref={keputusanRef} className="form-select" onChange={(e) => {
                                    setKeputusan(e.target.value)
                                }}>
                                    <option value="1">Diterima</option>
                                    <option value="2">Ditolak</option>
                                </select>
                            </div>
                            {keputusan == "2" &&
                                <>
                                    <div className="col col-auto">
                                        Alasan Penolakan:
                                    </div>
                                    <div className="col col-auto">
                                        <input type="text" ref={reasonRef} className="form-control" name="reason" placeholder="Alasan Penolakan" required={true} />
                                    </div>
                                </>
                            }
                            <div className="col col-auto">
                                <button className="btn btn-success" onClick={() => {

                                    handleSave()
                                }}><FontAwesomeIcon icon={faSave} style={{ color: "#ffffff" }} />&nbsp; Simpan</button>
                            </div>
                        </div>
                    }

                    {data?.status != "PENDING" &&
                        <div className="row d-flex align-items-center">
                            <div className="col col-auto">
                                Keputusan:
                            </div>
                            <div className="col col-auto">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data?.status || ''} // Add fallback empty string
                                    disabled={true}
                                />
                            </div>

                            <div className="col col-auto">
                                Dikonfirmasi Oleh:
                            </div>
                            <div className="col col-auto">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data?.confirmedBy || ''} // Add fallback empty string
                                    disabled={true}
                                />
                            </div>
                            {data?.status == "DITOLAK" &&
                                <>
                                    <div className="col col-auto">
                                        Alasan Penolakan:
                                    </div>
                                    <div className="col col-auto">
                                        <textarea
                                            className="form-control"
                                            value={data?.reason || ''} // Add fallback empty string
                                            disabled={true}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        setKeputusan(null)
                        onClose()
                    }}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            <Toaster />
        </>
    )
}

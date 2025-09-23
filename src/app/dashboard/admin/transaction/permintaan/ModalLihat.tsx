import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetDetailPermintaan, GetDetailPermintaanNomor, confirmPermintaan } from "@/app/lib/admin/users/userAPIRequest";
import { IPermintaan } from "./PermintaanTable";
import { Modal, Button, Card, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useState, useRef, useEffect } from "react";
import React from "react";
import api from "@/app/lib/axios";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

export default function ModalLihat({ data, show, onClose, onSave }: { data: IPermintaan | null, show: boolean, onClose: () => void, onSave: () => void }) {
    const [keputusan, setKeputusan] = useState<string | null>(null)
    const keputusanRef = useRef<HTMLSelectElement | null>(null)
    const reasonRef = useRef<HTMLInputElement | null>(null)

    const id = data?.id ?? null;
    const isAccepted = data?.status === "DITERIMA";

    const [isLoadingExport, setIsLoadingExport] = useState<boolean>(false);

    const {
        detailPermintaanNomor, isLoadingPermintaanNomor, errorNomor, mutateListPermintaanNomor
    } = GetDetailPermintaanNomor(isAccepted && id ? id : null);

    const {
        detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan
    } = GetDetailPermintaan(!isAccepted && id ? id : null);

    useEffect(() => {
        if (!show || !id) return;
        if (isAccepted) mutateListPermintaanNomor(); else mutateListPermintaan();
    }, [show, id, isAccepted, mutateListPermintaan, mutateListPermintaanNomor]);

    //console.log("Props: ", detailPermintaanNomor)

    function checkReason() {
        if (keputusan == "2") {
            return reasonRef.current?.value == "" ? false : true
        }

        return true
    }

    async function handleExporttoXLS(id: number) {
        if (!id) {
            toast.error("ID Kosong!");
            return
        }

        try {
            setIsLoadingExport(true);
            let query = `/users/mbr/request/export-request-to-xls?idRequest=${id}`;

            const response = await api.get(query, {
                responseType: "blob",
                apiVersion: "2"
            });

            const contentType = response.headers["content-type"];
            if (contentType.includes("application/json")) {
                const json = await response.data.text();
                const parsedData = JSON.parse(json);
                toast.success(parsedData.message);
                setIsLoadingExport(false);
                return;
            }

            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            //("Content ", response)
            const fileName = contentDisposition
                ? contentDisposition.split("filename=")[1].replace(/"/g, "")
                : "downloaded_file";

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setIsLoadingExport(false);
        } catch (error) {
            toast.error("Gagal Me-request Data",);
            setIsLoadingExport(false);
        }
    }

    async function handleSave() {
        if (!checkReason()) {
            toast.error("Alasan Penolakan Harus Diisi")
            return
        }

        let keputusanValue: "confirm" | "reject" = keputusanRef.current?.value == "1" ? "confirm" : "reject"

        try {
            const confirm = await confirmPermintaan(data, keputusanValue, reasonRef.current?.value)
            if ('data' in confirm!) {
                onSave()
                setKeputusan(null)
                onClose()
            }
        } catch (error) {
            toast.error("Konfirmasi Gagal!")
        }

    }

    return (
        <>
            <Modal show={show} onHide={() => {
                onClose()
                setKeputusan(null)
            }} size="xl" style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Permintaan RB</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Header Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0 fw-bold">Informasi Permintaan</h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">NIK Pembuat</small>
                                            <span className="fw-semibold">{data?.createdNIK}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Nama Pembuat</small>
                                            <span className="fw-semibold">{data?.createdBy}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Bagian Pembuat</small>
                                            <span className="fw-semibold">{data?.createdByBagian}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Tanggal Permintaan</small>
                                            <span className="fw-semibold">{data?.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Status</small>
                                            <span className={`fw-semibold ${data?.status === 'DITERIMA' ? 'text-success' :
                                                    data?.status === 'DITOLAK' ? 'text-danger' :
                                                        'text-warning'
                                                }`}>
                                                {data?.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Table Detail MBR */}
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between">
                            <h6 className="mb-0 fw-bold">Detail MBR</h6>
                            {data?.status == "DITERIMA" && <button className="btn btn-sm btn-success me-2" onClick={
                                () => { handleExporttoXLS(Number(data.id)) }
                            } disabled={isLoadingExport}>Export to xls <FontAwesomeIcon icon={faFileExcel} /></button>}
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive="sm" striped bordered hover className="align-middle text-center mb-0" variant="light">
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
                                                        <td rowSpan={item.items.length} className="fw-semibold">{produkIndex + 1}</td>
                                                        <td rowSpan={item.items.length} className="fw-semibold text-start">{item.namaProduk}</td>
                                                    </> : null}


                                                <td>{produk.nomorMBR}</td>
                                                <td>
                                                    <span className={`badge ${produk.tipeMBR === 'PO' ? 'bg-primary' : 'bg-info'}`}>
                                                        {produk.tipeMBR}
                                                    </span>
                                                </td>
                                                <td className="fw-semibold">{produk.jumlah}</td>
                                            </tr>
                                        ))
                                    ))}

                                    {data?.status === "DITERIMA" && !isLoadingPermintaanNomor && detailPermintaanNomor && detailPermintaanNomor.data.map((item: any, produkIndex: number) => (
                                        item.items.map((produk: any, index: number) => (
                                            <tr key={`${produkIndex}${index}`}>

                                                {index == 0 ?
                                                    <>
                                                        <td rowSpan={item.items.length} className="fw-semibold">{produkIndex + 1}</td>
                                                        <td rowSpan={item.items.length} className="fw-semibold text-start text-wrap">{item.namaProduk}</td>
                                                    </> : null}


                                                <td className="text-nowrap">{produk.nomorMBR}</td>
                                                <td>
                                                    <span className={`badge ${produk.tipeMBR === 'PO' ? 'bg-primary' : 'bg-info'}`}>
                                                        {produk.tipeMBR}
                                                    </span>
                                                </td>
                                                <td className="fw-semibold">{produk.jumlah}</td>
                                                <td className="fw-bold text-success">{produk.nomorAwal}</td>
                                                <td className="fw-bold text-success">{produk.nomorAkhir}</td>
                                            </tr>
                                        ))
                                    ))}

                                    {(!isLoadingPermintaan || !isLoadingPermintaanNomor) && errorNomor && error &&
                                        <tr>
                                            <td colSpan={data?.status == "DITERIMA" ? 7 : 5} className="text-center text-danger py-4">
                                                {errorNomor?.message || error?.message}
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    {/* Status and Decision Section */}
                    {data?.status == "PENDING" &&
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="mb-0 fw-bold">Konfirmasi Permintaan</h6>
                            </div>
                            <div className="card-body">
                                <div className="row g-3 align-items-center">
                                    <div className="col-12 col-md-auto">
                                        <span className="fw-semibold">Keputusan:</span>
                                    </div>
                                    <div className="col-12 col-md-auto">
                                        <select ref={keputusanRef} className="form-select" onChange={(e) => {
                                            setKeputusan(e.target.value)
                                        }}>
                                            <option value="1">Diterima</option>
                                            <option value="2">Ditolak</option>
                                        </select>
                                    </div>
                                    {keputusan == "2" &&
                                        <>
                                            <div className="col-12 col-md-auto">
                                                <span className="fw-semibold">Alasan Penolakan:</span>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <input type="text" ref={reasonRef} className="form-control" name="reason" placeholder="Alasan Penolakan" required={true} />
                                            </div>
                                        </>
                                    }
                                    <div className="col-12 col-md-auto">
                                        <button className="btn btn-success" onClick={() => {
                                            handleSave()
                                        }}>
                                            <FontAwesomeIcon icon={faSave} style={{ color: "#ffffff" }} />&nbsp; Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {data?.status != "PENDING" &&
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="mb-0 fw-bold">Status Keputusan</h6>
                            </div>
                            <div className="card-body">
                                <div className="row g-3 align-items-center">
                                    <div className="col-12 col-lg-auto">
                                        <span className="fw-semibold">Keputusan:</span>
                                    </div>
                                    <div className="col-12 col-lg-auto">
                                        <span className={`badge fs-6 px-3 py-2 ${data?.status === 'DITERIMA' ? 'bg-success' : 'bg-danger'
                                            }`}>
                                            {data?.status}
                                        </span>
                                    </div>

                                    <div className="col-12 col-lg-auto">
                                        <span className="fw-semibold">
                                            {data?.status === 'DITOLAK' ? 'Ditolak Oleh:' : 'Dikonfirmasi Oleh:'}
                                        </span>
                                    </div>
                                    <div className="col-12 col-lg-auto">
                                        <span className="text-muted">{data?.confirmedBy || ''}</span>
                                    </div>
                                    <div className="col-12 col-lg-auto">
                                        <span className="fw-semibold">
                                            {data?.status !== 'PENDING' ? 'Waktu Konfirmasi:' : ''}
                                        </span>
                                    </div>
                                    <div className="col-12 col-lg-auto">
                                        <span className="text-muted">{data?.confirmedAt || ''}</span>
                                    </div>
                                </div>

                                {data?.status == "DITOLAK" &&
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <div className="alert alert-danger">
                                                <div className="fw-semibold mb-2">Alasan Penolakan:</div>
                                                <div>{data?.reason || ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setKeputusan(null)
                        onClose()
                    }}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

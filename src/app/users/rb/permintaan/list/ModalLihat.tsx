import { toast } from 'react-toastify';
import { GetDetailPermintaan, GetDetailPermintaanNomor, usedPermintaanNomor } from "@/app/lib/admin/users/userAPIRequest";
import { IPermintaan } from "./List";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '@/app/lib/axios';

export default function ModalLihat({ data, show, onClose, onSave }: { data: IPermintaan | null, show: boolean, onClose: () => void, onSave: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState<boolean>(false)

    const { detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan } = data?.status !== "DITERIMA" ? GetDetailPermintaan(data ? Number(data.id) : null) : { detailPermintaan: null, isLoadingPermintaan: false, error: null, mutateListPermintaan: null }
    const { detailPermintaanNomor, isLoadingPermintaanNomor, errorNomor, mutateListPermintaanNomor } = data?.status == "DITERIMA" ? GetDetailPermintaanNomor(data ? Number(data.id) : null) : { detailPermintaanNomor: null, isLoadingPermintaanNomor: false, errorNomor: null, mutateListPermintaanNomor: null }

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

    async function handleSudahDipakai() {
        setIsSubmitting(true);
        try {
            const response = await usedPermintaanNomor(Number(data?.id));
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
                                            <small className="text-muted">ID Transaksi</small>
                                            <span className="fw-semibold">{data?.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">NIK Pembuat</small>
                                            <span className="fw-semibold">{data?.nikCreated}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Nama Pembuat</small>
                                            <span className="fw-semibold">{data?.namaCreated}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Bagian Pembuat</small>
                                            <span className="fw-semibold">{data?.namaBagianCreated}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Tanggal Permintaan</small>
                                            <span className="fw-semibold">{data?.timeCreated}</span>
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
                    <div className="card mb-4">
                        <div className="d-flex card-header justify-content-between">
                            <h6 className="mb-0 fw-bold">Detail MBR</h6>
                            {data?.status == "DITERIMA" && <button className="btn btn-sm btn-success me-2" onClick={
                                () => { handleExporttoXLS(Number(data.id)) }
                            }>Export to xls <FontAwesomeIcon icon={faFileExcel} /></button>}
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-bordered align-middle text-center mb-0">
                                    <thead className="table-dark">
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
                                                <tr key={index}>

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
                                                    <td className="fw-bold text-success">{produk.nomorAwal}</td>
                                                    <td className="fw-bold text-success">{produk.nomorAkhir}</td>
                                                </tr>
                                            ))
                                        ))}

                                        {(isLoadingPermintaan || isLoadingPermintaanNomor) && error &&
                                            <tr>
                                                <td colSpan={data?.status == "DITERIMA" ? 7 : 5} className="text-center py-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        }

                                        {(!isLoadingPermintaan || !isLoadingPermintaanNomor) && error &&
                                            <tr>
                                                <td colSpan={data?.status == "DITERIMA" ? 7 : 5} className="text-center text-danger py-4">
                                                    {error.message}
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Status Information */}
                    {data?.status == "PENDING" &&
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="mb-0 fw-bold">Status Keputusan</h6>
                            </div>
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-auto">
                                        <span className="fw-semibold">Keputusan:</span>
                                    </div>
                                    <div className="col-12 col-md-auto">
                                        <span className="badge bg-warning text-dark fs-6 px-3 py-2">PENDING</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {(data?.status == "DITERIMA" || data?.status == "DITOLAK") &&
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
                                        <span className="text-muted">{data?.namaConfirmed}</span>
                                    </div>
                                </div>

                                {data?.status == "DITOLAK" &&
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <div className="alert alert-danger">
                                                <div className="fw-semibold mb-2">Alasan Penolakan:</div>
                                                <div>{data?.reason}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <div>
                        {data?.status === "DITERIMA" && Boolean(data.used) !== true &&
                            <Button variant="success" onClick={() => {
                                handleSudahDipakai()
                            }} disabled={isSubmitting} className="me-2">
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Memproses...
                                    </>
                                ) : (
                                    'Tandai Sudah Dipakai'
                                )}
                            </Button>
                        }
                    </div>
                    <Button variant="secondary" onClick={() => {
                        onClose()
                    }} disabled={isSubmitting}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

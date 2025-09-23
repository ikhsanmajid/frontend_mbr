import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetDetailPermintaan, GetDetailPermintaanNomor, usedPermintaanNomor } from "@/app/lib/admin/users/userAPIRequest";
import { IPermintaan } from "./List";
import { Modal, Button, Dropdown, Card, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useState } from "react";
import api from '@/app/lib/axios';
import jsPDF from 'jspdf';

interface ModalLihatProps {
    data: IPermintaan | null;
    show: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function ModalLihat({ data, show, onClose, onSave }: ModalLihatProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState<boolean>(false);
    const [isLoadingPDF, setIsLoadingPDF] = useState<{ [key: string]: boolean }>({});

    const isAccepted = data?.status === "DITERIMA";
    const dataId = data ? Number(data.id) : null;

    const {
        detailPermintaan,
        isLoadingPermintaan,
        error,
        mutateListPermintaan
    } = !isAccepted
            ? GetDetailPermintaan(dataId)
            : { detailPermintaan: null, isLoadingPermintaan: false, error: null, mutateListPermintaan: null };

    const {
        detailPermintaanNomor,
        isLoadingPermintaanNomor,
        errorNomor,
        mutateListPermintaanNomor
    } = isAccepted
            ? GetDetailPermintaanNomor(dataId)
            : { detailPermintaanNomor: null, isLoadingPermintaanNomor: false, errorNomor: null, mutateListPermintaanNomor: null };

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

    async function handleDownloadPDF(
        produkIndex: number,
        itemIndex: number,
        nomorMBR: string,
        nomorAwal: string,
        nomorAkhir: string,
        orientation: 'portrait' | 'landscape' = 'portrait'
    ) {
        const loadingKey = `${produkIndex}-${itemIndex}`;

        if (!nomorAwal || !nomorAkhir) {
            toast.error("Nomor awal atau akhir tidak tersedia!");
            return;
        }

        try {
            setIsLoadingPDF(prev => ({ ...prev, [loadingKey]: true }));

            await openPDFInNewTab({
                nomorMBR,
                nomorAwal,
                nomorAkhir,
                orientation
            });

            toast.success("PDF berhasil dibuka di tab baru!");
        } catch (error) {
            toast.error("Gagal membuka PDF");
            console.error("Open PDF error:", error);
        } finally {
            setIsLoadingPDF(prev => ({ ...prev, [loadingKey]: false }));
        }
    }

    function openPDFInNewTab({
        nomorMBR,
        nomorAwal,
        nomorAkhir,
        orientation = 'portrait'
    }: {
        nomorMBR: string;
        nomorAwal: string;
        nomorAkhir: string;
        orientation?: 'portrait' | 'landscape';
    }) {
        return new Promise<void>((resolve, reject) => {
            try {
                const doc = new jsPDF({ orientation, format: 'a4' });

                const startNum = parseInt(nomorAwal);
                const endNum = parseInt(nomorAkhir);

                const xPosition = orientation === "portrait" ? 170 : 240;
                const yPosition = orientation === "portrait" ? 30 : 40;

                for (let i = startNum; i <= endNum; i++) {
                    if (i > startNum) {
                        doc.addPage();
                    }

                    const currentNumber = i.toString().padStart(6, '0');

                    doc.setFontSize(18);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('red')
                    doc.text(currentNumber, xPosition, yPosition);
                }

                const pdfBlob = doc.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);

                const newTab = window.open(pdfUrl, '_blank');

                if (!newTab) {
                    throw new Error('Popup Blocked');
                }

                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                }, 1000);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
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
            <style>{`
                .table-responsive {
                    overflow: visible !important;
                }
                .card-body {
                    overflow: visible !important;
                }
                .dropdown-menu {
                    z-index: 9999 !important;
                    position: fixed !important;
                }
                .table td:last-child {
                    overflow: visible !important;
                }
            `}</style>
            <Modal show={show} onHide={() => {
                onClose()
            }} size="xl" style={{ zIndex: 1050 }} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Permintaan RB</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Header Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h6 className="mb-0 fw-bold">Informasi Permintaan</h6>
                        </Card.Header>
                        <Card.Body>
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
                        </Card.Body>
                    </Card>
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
                                                <th scope="col">View PDF</th>
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


                                                <td className="text-nowrap">{produk.nomorMBR}</td>
                                                <td>
                                                    <span className={`badge ${produk.tipeMBR === 'PO' ? 'bg-primary' : 'bg-info'}`}>
                                                        {produk.tipeMBR}
                                                    </span>
                                                </td>
                                                <td className="fw-semibold">{produk.jumlah}</td>
                                                <td className="fw-bold text-success">{produk.nomorAwal}</td>
                                                <td className="fw-bold text-success">{produk.nomorAkhir}</td>
                                                <td>
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant="danger"
                                                            size="sm"
                                                            disabled={isLoadingPDF[`${produkIndex}-${index}`]}
                                                        >
                                                            {isLoadingPDF[`${produkIndex}-${index}`] ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            ) : (
                                                                <>
                                                                    <FontAwesomeIcon icon={faFilePdf} className="me-1" />
                                                                </>
                                                            )}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu
                                                            popperConfig={{
                                                                strategy: 'fixed',
                                                                modifiers: [
                                                                    {
                                                                        name: 'preventOverflow',
                                                                        options: {
                                                                            boundary: 'viewport',
                                                                            altAxis: true,
                                                                            padding: 8
                                                                        }
                                                                    }
                                                                ]
                                                            }}
                                                        >
                                                            <Dropdown.Item
                                                                onClick={() => handleDownloadPDF(
                                                                    produkIndex,
                                                                    index,
                                                                    produk.nomorMBR,
                                                                    produk.nomorAwal,
                                                                    produk.nomorAkhir,
                                                                    'portrait'
                                                                )}
                                                                disabled={isLoadingPDF[`${produkIndex}-${index}`]}
                                                            >
                                                                Portrait
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => handleDownloadPDF(
                                                                    produkIndex,
                                                                    index,
                                                                    produk.nomorMBR,
                                                                    produk.nomorAwal,
                                                                    produk.nomorAkhir,
                                                                    'landscape'
                                                                )}
                                                                disabled={isLoadingPDF[`${produkIndex}-${index}`]}
                                                            >
                                                                Landscape
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))
                                    ))}

                                    {(isLoadingPermintaan || isLoadingPermintaanNomor) && error &&
                                        <tr>
                                            <td colSpan={data?.status == "DITERIMA" ? 8 : 5} className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    }

                                    {(!isLoadingPermintaan || !isLoadingPermintaanNomor) && error &&
                                        <tr>
                                            <td colSpan={data?.status == "DITERIMA" ? 8 : 5} className="text-center text-danger py-4">
                                                {error.message}
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    {/* Status Information */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h6 className="mb-0 fw-bold">Status Keputusan</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="row g-3 align-items-center">
                                <div className="col-12 col-lg-auto">
                                    <span className="fw-semibold">Keputusan:</span>
                                </div>
                                <div className="col-12 col-lg-auto">
                                    <span className={`badge fs-6 px-3 py-2 ${data?.status === 'DITERIMA' ? 'bg-success' :
                                            data?.status === 'DITOLAK' ? 'bg-danger' :
                                                'bg-warning text-dark'
                                        }`}>
                                        {data?.status}
                                    </span>
                                </div>

                                {(data?.status === "DITERIMA" || data?.status === "DITOLAK") && (
                                    <>
                                        <div className="col-12 col-lg-auto">
                                            <span className="fw-semibold">
                                                {data?.status === 'DITOLAK' ? 'Ditolak Oleh:' : 'Dikonfirmasi Oleh:'}
                                            </span>
                                        </div>
                                        <div className="col-12 col-lg-auto">
                                            <span className="text-muted">{data?.namaConfirmed}</span>
                                        </div>
                                        <div className="col-12 col-lg-auto">
                                            <span className="fw-semibold">
                                                Waktu Konfirmasi:
                                            </span>
                                        </div>
                                        <div className="col-12 col-lg-auto">
                                            <span className="text-muted">{data?.timeConfirmed}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {data?.status === "DITOLAK" && (
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="alert alert-danger">
                                            <div className="fw-semibold mb-2">Alasan Penolakan:</div>
                                            <div>{data?.reason}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <div>
                        {data?.status === "DITERIMA" && Boolean(data.used) !== true &&
                            <Button variant="success" onClick={() => {
                                handleSudahDipakai()
                                onClose()
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

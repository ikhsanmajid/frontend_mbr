import { FetchAllProduk, GetDetailPermintaan, editPermintaanNomor } from "@/app/lib/admin/users/userAPIRequest";
import { IPermintaan } from "./List";
import { Modal, Button } from "react-bootstrap";
import { nanoid } from "nanoid";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import Select from 'react-select';


import React from "react";

interface IProduk {
    id: number;
    idBagian: number;
    idKategori: number;
    namaProduk: string;
    namaBagian: string;
    namaKategori: string;
    isActive: boolean;
}

interface IPermintaanEdit {
    uuid: string;
    idProduk: number;
    namaProduk: string,
    mbr: {
        no_mbr: string;
        jumlah: number;
        tipe_mbr: string;
    }[];
}

interface IValidationErrors {
    [uuid: string]: {
        idProduk?: string;
        mbr?: {
            [mbrIndex: number]: {
                no_mbr?: string;
                jumlah?: string;
            }
        }
    }
}

export default function ModalEdit({ data, show, onClose }: { data: IPermintaan | null, show: boolean, onClose: (message?: string) => void }) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [listPermintaan, setListPermintaan] = useState<IPermintaanEdit[] | null>(null);
    const [produkList2, setProdukList2] = useState<{ value: number, label: string }[]>([]);
    const [validationErrors, setValidationErrors] = useState<IValidationErrors>({});
    const [collapseStates, setCollapseStates] = useState<{ [key: string]: boolean }>({});
    const { detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan } = data?.status !== "DITERIMA" ? GetDetailPermintaan(data ? Number(data.id) : null) : { detailPermintaan: null, isLoadingPermintaan: false, error: null, mutateListPermintaan: null }
    const { listProduk, isLoadingListProduk, error: isErrorListProduk } = FetchAllProduk();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isLoadingListProduk) return;
        if (isErrorListProduk) {
            toast.error("Gagal Memuat Data Produk");
            return;
        }
        setProdukList2([]);
        listProduk.data.map((items: any) => {
            if (items.isActive) {
                setProdukList2((prev) => (
                    (prev ? [...prev, { value: items.id, label: items.namaProduk }] : [{ value: items.id, label: items.namaProduk }])
                ))
            }
        })
    }, [isLoadingListProduk, isErrorListProduk, listProduk]);

    useEffect(() => {
        if (isLoadingPermintaan) return;
        if (error) {
            toast.error("Gagal Memuat Data Permintaan");
            console.log("Error:", error);
            return;
        }

        if (detailPermintaan) {
            const newData = detailPermintaan.data.map((data: any) => {
                return {
                    uuid: nanoid(),
                    idProduk: data.idProduk,
                    namaProduk: data.namaProduk,
                    mbr: data.items.map((mbr: any) => {
                        return {
                            no_mbr: mbr.nomorMBR,
                            jumlah: mbr.jumlah,
                            tipe_mbr: mbr.tipeMBR
                        }
                    })
                }
            });

            setListPermintaan(newData);
        }
    }, [isLoadingPermintaan, error, detailPermintaan]);

    function handleDeleteMBRItem(index: number, mbrIndex: number) {
        const newList = listPermintaan?.map((permintaan, idx) => {
            if (idx === index) {
                const updatedMBR = permintaan.mbr.filter((_, idx) => idx !== mbrIndex);
                if (updatedMBR.length === 0) {
                    return null;
                }
                return {
                    ...permintaan,
                    mbr: updatedMBR
                };
            }
            return permintaan;
        }).filter(permintaan => permintaan !== null) || null;

        setListPermintaan(newList);
        
        // Clear validation errors for deleted MBR item
        if (listPermintaan && listPermintaan[index]) {
            const permintaanUuid = listPermintaan[index].uuid;
            setValidationErrors(prev => {
                if (prev[permintaanUuid]?.mbr) {
                    const newMbrErrors = { ...prev[permintaanUuid].mbr };
                    delete newMbrErrors[mbrIndex];
                    
                    // Reindex remaining MBR errors
                    const reindexedMbrErrors: { [key: number]: { no_mbr?: string; jumlah?: string } } = {};
                    Object.keys(newMbrErrors).forEach(key => {
                        const numKey = parseInt(key);
                        if (numKey > mbrIndex) {
                            reindexedMbrErrors[numKey - 1] = newMbrErrors[numKey];
                        } else if (numKey < mbrIndex) {
                            reindexedMbrErrors[numKey] = newMbrErrors[numKey];
                        }
                    });
                    
                    return {
                        ...prev,
                        [permintaanUuid]: {
                            ...prev[permintaanUuid],
                            mbr: Object.keys(reindexedMbrErrors).length > 0 ? reindexedMbrErrors : undefined
                        }
                    };
                }
                return prev;
            });
        }
    }

    function validateInputs() {
        const errors: IValidationErrors = {};
        let hasErrors = false;

        for (const permintaan of listPermintaan || []) {
            const permintaanErrors: IValidationErrors[string] = {};

            // Validasi produk
            if (!permintaan.idProduk || permintaan.idProduk === 0) {
                permintaanErrors.idProduk = "Nama produk harus dipilih";
                hasErrors = true;
            }

            // Validasi MBR
            const mbrErrors: { [mbrIndex: number]: { no_mbr?: string; jumlah?: string } } = {};
            
            permintaan.mbr.forEach((mbr, mbrIndex) => {
                const mbrError: { no_mbr?: string; jumlah?: string } = {};
                
                if (!mbr.no_mbr.trim()) {
                    mbrError.no_mbr = "No MBR tidak boleh kosong";
                    hasErrors = true;
                } else if ((mbr.no_mbr.match(/-/g) || []).length < 2) {
                    mbrError.no_mbr = "No MBR harus memiliki minimal 2 karakter '-'";
                    hasErrors = true;
                }
                
                if (!mbr.jumlah || mbr.jumlah <= 0) {
                    mbrError.jumlah = "Jumlah harus lebih dari 0";
                    hasErrors = true;
                }

                if (Object.keys(mbrError).length > 0) {
                    mbrErrors[mbrIndex] = mbrError;
                }
            });

            if (Object.keys(mbrErrors).length > 0) {
                permintaanErrors.mbr = mbrErrors;
            }

            if (Object.keys(permintaanErrors).length > 0) {
                errors[permintaan.uuid] = permintaanErrors;
            }
        }

        setValidationErrors(errors);

        if (hasErrors) {
            // Open all collapses when there are validation errors so user can see all errors
            const newCollapseStates: { [key: string]: boolean } = {};
            if (listPermintaan) {
                listPermintaan.forEach(permintaan => {
                    newCollapseStates[permintaan.uuid] = true; // true means expanded/open
                });
                setCollapseStates(newCollapseStates);
            }
            
            toast.error("Mohon lengkapi semua field yang diperlukan", {
                className: "w-75"
            });
            return false;
        }

        return true;
    }

    function addProduk() {
        if (!listPermintaan) {
            setListPermintaan([{
                uuid: nanoid(),
                idProduk: 0,
                namaProduk: "",
                mbr: [{
                    no_mbr: "",
                    jumlah: 0,
                    tipe_mbr: "PO"
                }]
            }]);
            return;
        }

        const newUuid = nanoid();
        setListPermintaan([...listPermintaan!, {
            uuid: newUuid,
            idProduk: 0,
            namaProduk: "",
            mbr: [{
                no_mbr: "",
                jumlah: 0,
                tipe_mbr: "PO"
            }]
        }]);
    }

    function deleteProduk(idPermintaan: string) {
        setListPermintaan((prevListPermintaan) => {
            const newList = prevListPermintaan?.filter((permintaan) => permintaan.uuid !== idPermintaan) || null;
            return newList;
        });
        
        // Clear validation errors for deleted product
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[idPermintaan];
            return newErrors;
        });
    }

    function handleChangeProduk(uuid: string, value: string | number, namaProduk: string) {
        const newList = listPermintaan?.map((permintaan) => {
            if (permintaan.uuid === uuid) {
                return {
                    ...permintaan,
                    idProduk: Number(value),
                    namaProduk: namaProduk,
                };
            }
            return permintaan;
        }) || null;

        setListPermintaan(newList);
        
        // Clear validation errors for this field
        if (validationErrors[uuid]?.idProduk) {
            setValidationErrors(prev => ({
                ...prev,
                [uuid]: {
                    ...prev[uuid],
                    idProduk: undefined
                }
            }));
        }
    }

    function addMBRItem(uuid: string) {
        const newList = listPermintaan?.map((permintaan) => {
            if (permintaan.uuid === uuid) {
                return {
                    ...permintaan,
                    mbr: [
                        ...permintaan.mbr,
                        {
                            no_mbr: "",
                            jumlah: 0,
                            tipe_mbr: "PO"
                        }
                    ]
                };
            }
            return permintaan;
        }) || null;

        setListPermintaan(newList);
        //console.log("Add MBR Item", listPermintaan);
    }

    function handleChangeMBR(uuid: string, mbrIndex: number, field: string, value: string) {
        const newList = listPermintaan?.map((permintaan) => {
            if (permintaan.uuid === uuid) {
                return {
                    ...permintaan,
                    mbr: permintaan.mbr.map((mbr, mbrIdx) => {
                        if (mbrIdx === mbrIndex) {
                            return {
                                ...mbr,
                                [field]: field === 'jumlah' ? Number(value) : value
                            };
                        }
                        return mbr;
                    })
                };
            }
            return permintaan;
        }) || null;

        setListPermintaan(newList);
        
        // Clear validation errors for this field
        if (validationErrors[uuid]?.mbr?.[mbrIndex] && (field === 'no_mbr' || field === 'jumlah')) {
            setValidationErrors(prev => ({
                ...prev,
                [uuid]: {
                    ...prev[uuid],
                    mbr: {
                        ...prev[uuid]?.mbr,
                        [mbrIndex]: {
                            ...prev[uuid]?.mbr?.[mbrIndex],
                            [field]: undefined
                        }
                    }
                }
            }));
        }
    }

    useEffect(() => {
        if (listPermintaan?.length == 0) {
            setListPermintaan(null);
        }
    }, [listPermintaan])

    async function submitPermintaan() {
        if (!validateInputs()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await editPermintaanNomor(Number(data?.id), listPermintaan);
            if (response.status === "success") {
                setIsSubmitting(false);
                setValidationErrors({}); // Clear all validation errors
                onClose("Berhasil mengirim ulang RB.");
            } else {
                toast.error("Gagal menambah mengirim ulang RB.");
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
            }} size="xl" style={{ zIndex: 1050 }} backdrop="static" keyboard={false} animation>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Permintaan RB</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoadingListProduk ? 
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Memuat data produk...</p>
                        </div>
                    :
                        <>
                            {/* Status Information */}
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
                                                <span className={`badge fs-6 px-3 py-2 ${
                                                    data?.status === 'DITERIMA' ? 'bg-success' : 'bg-danger'
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

                            {/* Form Edit Permintaan */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h6 className="mb-0 fw-bold">Form Edit Permintaan</h6>
                                </div>
                                <div className="card-body">
                                    {/* Desktop Header */}
                                    <div className="row d-none d-lg-flex mb-3 py-3 bg-light rounded">
                                        <div className="col-1 fw-semibold ps-5 d-flex align-items-center justify-content-center">
                                            No.
                                        </div>
                                        <div style={{marginLeft: -20}} className="col-3 fw-semibold ps-5 d-flex align-items-center">
                                            Nama Produk
                                        </div>
                                        <div style={{marginLeft: 25}} className="col-3 fw-semibold ps-3 d-flex align-items-center">
                                            No Dokumen MBR
                                        </div>
                                        <div style={{marginLeft: -40}} className="col-1 fw-semibold d-flex align-items-start justify-content-start">
                                            Tipe MBR
                                        </div>
                                        <div className="col-1 fw-semibold d-flex align-items-start justify-content-start">
                                            Jumlah
                                        </div>
                                        <div style={{marginLeft: 28}} className="col-1 fw-semibold d-flex align-items-start justify-content-start">
                                            Aksi
                                        </div>
                                    </div>

                                    {/* Empty State */}
                                    {!listPermintaan && (
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="text-center py-5">
                                                    <div className="text-muted mb-3">
                                                        <h5>Belum ada produk yang ditambahkan</h5>
                                                        <p>Klik tombol &quot;Tambah Produk&quot; untuk memulai membuat permintaan RB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Cards */}
                                    {listPermintaan && listPermintaan?.map((data, index) => (
                                        <div key={data.uuid} className="border rounded p-3 mb-3 shadow-sm">
                                            {/* Mobile Layout */}
                                            <div className="d-lg-none">
                                                {/* Collapsible Header */}
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="fw-bold mb-0">Produk #{index + 1}</h6>
                                                    <button 
                                                        className="btn btn-outline-primary" 
                                                        type="button" 
                                                        style={{ minWidth: '40px', minHeight: '40px', fontSize: '18px', fontWeight: 'bold' }}
                                                        onClick={() => {
                                                            setCollapseStates(prev => ({
                                                                ...prev,
                                                                [data.uuid]: !prev[data.uuid]
                                                            }));
                                                        }}
                                                    >
                                                        {collapseStates[data.uuid] ? '−' : '+'}
                                                    </button>
                                                </div>
                                                
                                                {/* Collapsible Content - Controlled by React state */}
                                                <div className={`${collapseStates[data.uuid] ? '' : 'd-none'}`}>
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold">Nama Produk</label>
                                                        {isMounted ? <Select className="mb-2" onChange={(e) => handleChangeProduk(data.uuid, e!.value, e!.label)} options={produkList2} isLoading={isLoadingListProduk} defaultValue={produkList2[produkList2.findIndex(p => p.value == data.idProduk)]} /> : null}
                                                        {validationErrors[data.uuid]?.idProduk && (
                                                            <div className="text-danger small mb-2">{validationErrors[data.uuid].idProduk}</div>
                                                        )}
                                                        <button onClick={() => deleteProduk(data.uuid)} className="btn btn-sm btn-danger w-100" style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}} disabled={isSubmitting}>Hapus Produk</button>
                                                    </div>
                                                    
                                                    {data.mbr.map((mbr, mbrIndex) => (
                                                        <div key={mbrIndex} className="border-top pt-3 mb-3">
                                                            <h6 className="fw-semibold">MBR #{mbrIndex + 1}</h6>
                                                            
                                                            <div className="mb-2">
                                                                <label className="form-label fw-semibold">No Dokumen MBR</label>
                                                                <input
                                                                    type="text"
                                                                    className={`form-control ${validationErrors[data.uuid]?.mbr?.[mbrIndex]?.no_mbr ? 'is-invalid' : ''}`}
                                                                    placeholder="No MBR"
                                                                    value={mbr.no_mbr}
                                                                    onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'no_mbr', e.target.value)}
                                                                    disabled={isSubmitting}
                                                                />
                                                                {validationErrors[data.uuid]?.mbr?.[mbrIndex]?.no_mbr && (
                                                                    <div className="text-danger small mt-1">{validationErrors[data.uuid].mbr![mbrIndex].no_mbr}</div>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="row mb-2">
                                                                <div className="col-6">
                                                                    <label className="form-label fw-semibold">Tipe MBR</label>
                                                                    <select
                                                                        className="form-select"
                                                                        aria-label="Pilih Tipe MBR"
                                                                        value={mbr.tipe_mbr}
                                                                        onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'tipe_mbr', e.target.value)}
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <option value="PO">PO</option>
                                                                        <option value="PS">PS</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-6">
                                                                    <label className="form-label fw-semibold">Jumlah</label>
                                                                    <input
                                                                        type="number"
                                                                        className={`form-control ${validationErrors[data.uuid]?.mbr?.[mbrIndex]?.jumlah ? 'is-invalid' : ''}`}
                                                                        placeholder="0"
                                                                        min="1"
                                                                        value={mbr.jumlah}
                                                                        onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'jumlah', e.target.value)}
                                                                        disabled={isSubmitting}
                                                                    />
                                                                    {validationErrors[data.uuid]?.mbr?.[mbrIndex]?.jumlah && (
                                                                        <div className="text-danger small mt-1">{validationErrors[data.uuid].mbr![mbrIndex].jumlah}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <button onClick={() => handleDeleteMBRItem(index, mbrIndex)} className="btn btn-sm btn-danger w-100" style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}} disabled={isSubmitting}>Hapus</button>
                                                        </div>
                                                    ))}
                                                    
                                                    <button onClick={() => addMBRItem(data.uuid)} className="btn btn-sm btn-success w-100" style={{backgroundColor: '#198754', borderColor: '#198754'}} disabled={isSubmitting}>Tambah PO/PS</button>
                                                </div>
                                            </div>

                                            {/* Desktop Layout */}
                                            <div className="d-none d-lg-block">
                                                <div className="row">
                                                    <div className="col-1 d-flex align-items-start justify-content-center pt-2">
                                                        <span className="badge bg-primary fs-6">{index + 1}</span>
                                                    </div>
                                                    <div className="col-3">
                                                        <div className="mb-2">
                                                            {isMounted ? <Select className="mb-2" onChange={(e) => handleChangeProduk(data.uuid, e!.value, e!.label)} options={produkList2} isLoading={isLoadingListProduk} defaultValue={produkList2[produkList2.findIndex(p => p.value == data.idProduk)]} /> : null}
                                                            {validationErrors[data.uuid]?.idProduk && (
                                                                <div className="text-danger small mb-2">{validationErrors[data.uuid].idProduk}</div>
                                                            )}
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button onClick={() => deleteProduk(data.uuid)} className="btn btn-sm btn-danger" disabled={isSubmitting}>
                                                                Hapus Produk
                                                            </button>
                                                            <button onClick={() => addMBRItem(data.uuid)} className="btn btn-sm btn-success" disabled={isSubmitting}>
                                                                Tambah PO/PS
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <table className="table table-borderless table-sm mb-0">
                                                            <tbody>
                                                                {data.mbr.map((mbr, mbrIndex) => (
                                                                    <tr key={mbrIndex}>
                                                                        <td style={{width: '30.5%', paddingLeft: '0', paddingRight: '8px'}}>
                                                                            <input
                                                                                type="text"
                                                                                className={`form-control ${validationErrors[data.uuid]?.mbr?.[mbrIndex]?.no_mbr ? 'is-invalid' : ''}`}
                                                                                placeholder="CC-00001-00-NL"
                                                                                value={mbr.no_mbr}
                                                                                onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'no_mbr', e.target.value)}
                                                                                disabled={isSubmitting}
                                                                            />
                                                                            {validationErrors[data.uuid]?.mbr?.[mbrIndex]?.no_mbr && (
                                                                                <div className="text-danger small mt-1">{validationErrors[data.uuid].mbr![mbrIndex].no_mbr}</div>
                                                                            )}
                                                                        </td>
                                                                        <td style={{width: '10.5%', paddingLeft: '8px', paddingRight: '8px'}}>
                                                                            <select
                                                                                className="form-select"
                                                                                aria-label="Pilih Tipe MBR"
                                                                                value={mbr.tipe_mbr}
                                                                                onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'tipe_mbr', e.target.value)}
                                                                                disabled={isSubmitting}
                                                                            >
                                                                                <option value="PO">PO</option>
                                                                                <option value="PS">PS</option>
                                                                            </select>
                                                                        </td>
                                                                        <td style={{width: '15.5%', paddingLeft: '8px', paddingRight: '8px'}}>
                                                                            <input
                                                                                type="number"
                                                                                className={`form-control text-center ${validationErrors[data.uuid]?.mbr?.[mbrIndex]?.jumlah ? 'is-invalid' : ''}`}
                                                                                placeholder="0"
                                                                                min="1"
                                                                                value={mbr.jumlah}
                                                                                onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'jumlah', e.target.value)}
                                                                                disabled={isSubmitting}
                                                                            />
                                                                            {validationErrors[data.uuid]?.mbr?.[mbrIndex]?.jumlah && (
                                                                                <div className="text-danger small mt-1 text-center">{validationErrors[data.uuid].mbr![mbrIndex].jumlah}</div>
                                                                            )}
                                                                        </td>
                                                                        <td style={{width: '12.5%', paddingLeft: '8px', paddingRight: '0'}} className="text-center">
                                                                            <button 
                                                                                onClick={() => handleDeleteMBRItem(index, mbrIndex)} 
                                                                                className="btn btn-sm btn-danger" 
                                                                                disabled={isSubmitting}
                                                                                title="Hapus MBR"
                                                                            >
                                                                                Hapus
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Action Buttons */}
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-start gap-3">
                                                <button 
                                                    onClick={addProduk} 
                                                    className="btn btn-primary d-flex align-items-center" 
                                                    disabled={isSubmitting}
                                                    style={{
                                                        animation: !isSubmitting ? 'bounce 2s infinite' : 'none'
                                                    }}
                                                >
                                                    Tambah Produk
                                                </button>
                                                <button 
                                                    onClick={submitPermintaan} 
                                                    className="btn btn-success d-flex align-items-center"
                                                    disabled={(isSubmitting || listPermintaan == null)}
                                                    style={{
                                                        animation: !isSubmitting && listPermintaan ? 'bounce 2s infinite' : 'none'
                                                    }}
                                                >
                                                    {isSubmitting ? 'Mengirim...' : 'Kirim Ulang Permintaan'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
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

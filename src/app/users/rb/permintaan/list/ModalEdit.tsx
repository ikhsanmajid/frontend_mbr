import { IPermintaan } from "./List";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { FetchAllProduk, addPermintaanNomor, GetDetailPermintaan, editPermintaanNomor } from "@/app/lib/admin/users/userAPIRequest";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { nanoid } from "nanoid";
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

export default function ModalEdit({ session, data, show, onClose }: { session: string, data: IPermintaan | null, show: boolean, onClose: (message?: string) => void }) {
    const { listProduk, isLoadingListProduk, error: isErrorListProduk } = FetchAllProduk(session);
    const { detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan } = data?.status !== "DITERIMA" ? GetDetailPermintaan(session, data ? Number(data.id) : null) : { detailPermintaan: null, isLoadingPermintaan: false, error: null, mutateListPermintaan: null }
    const [produkList2, setProdukList2] = useState<{ value: number, label: string }[]>([]);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [listPermintaan, setListPermintaan] = useState<IPermintaanEdit[] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        toast.dismiss();
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
    }

    function validateInputs() {
        for (const permintaan of listPermintaan || []) {
            if (!permintaan.idProduk || permintaan.mbr.some(mbr => !mbr.no_mbr || !mbr.jumlah || !mbr.tipe_mbr)) {
                toast.error("Semua field Nama Produk, No MBR, Tipe MBR, dan Jumlah harus diisi.");
                return false;
            }

            if (permintaan.mbr.some(mbr => (mbr.no_mbr.match(/-/g) || []).length < 2)) {
                toast.error("No MBR harus memiliki minimal 2 karakter '-'.");
                return false;
            }
        }
        return true;
    }

    function addProduk() {
        if (!validateInputs()) {
            return;
        }

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

        setListPermintaan([...listPermintaan!, {
            uuid: nanoid(),
            idProduk: 0,
            namaProduk: "",
            mbr: [{
                no_mbr: "",
                jumlah: 0,
                tipe_mbr: "PO"
            }]
        }]);
        //console.log("Add Produk", listPermintaan);
    }

    function deleteProduk(idPermintaan: string) {
        setListPermintaan((prevListPermintaan) => {
            const newList = prevListPermintaan?.filter((permintaan) => permintaan.uuid !== idPermintaan) || null;
            return newList;
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
        //console.log("Change Produk", listPermintaan);
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
        //console.log("Change MBR", listPermintaan);
    }

    async function submitPermintaan() {
        if (!validateInputs()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await editPermintaanNomor(Number(data?.id), listPermintaan, session);
            if (response.status === "success") {
                setIsSubmitting(false);
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
            }} dialogClassName="modal-80w" style={{ zIndex: 1050 }} backdrop="static" keyboard={false} animation>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Permintaan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoadingListProduk ? <p>Loading...</p> :
                        <>
                            <div className="row mb-3">
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
                            </div>

                            <div className="row">
                                <div className="col-1">
                                    No.
                                </div>
                                <div className="col-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Nama Produk</label>
                                </div>
                                <div className="col-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">No. MBR</label>
                                </div>
                                <div className="col-1">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Tipe MBR</label>
                                </div>
                                <div className="col-1">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Jumlah</label>
                                </div>
                                <div className="col-1">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Delete</label>
                                </div>
                            </div>
                            {listPermintaan && listPermintaan?.map((data, index) => (
                                <div key={data.uuid} className="row">
                                    <div className="col-1">
                                        {index + 1}
                                    </div>
                                    <div className="col-3">
                                        {isMounted ? <Select className="mb-2" onChange={(e) => handleChangeProduk(data.uuid, e!.value, e!.label)} options={produkList2} isLoading={isLoadingListProduk} defaultValue={produkList2[produkList2.findIndex(p => p.value == data.idProduk)]} /> : null}
                                        {/* <select
                                        onChange={(e) => handleChangeProduk(data.uuid, e.target.value)}
                                        className="form-select mb-2"
                                        aria-label="Default select example"
                                        value={data.idProduk}
                                        disabled={isSubmitting}
                                    >
                                        <option value="0">--- Pilih Produk ---</option>
                                        { produkList?.filter(data => data.isActive).map((data, index) => (
                                            <option key={index} value={data.id}>{data.namaProduk}</option>
                                        ))}
                                    </select> */}
                                        {/* <select
                                            onChange={(e) => handleChangeProduk(data.uuid, e.target.value, e.target.selectedOptions[0].getAttribute('data-product-name')!)}
                                            className="form-select mb-2"
                                            aria-label="Default select example"
                                            value={data.idProduk}
                                            disabled={isSubmitting}
                                        >
                                            <option value="0">--- Pilih Produk ---</option>
                                            {produkList?.filter(data => data.isActive).map((data, index) => (
                                                <option key={index} value={data.id} data-product-name={data.namaProduk}>{data.namaProduk}</option>
                                            ))}
                                        </select> */}
                                        <button onClick={() => deleteProduk(data.uuid)} className="btn btn-sm btn-danger mb-3" disabled={isSubmitting}>Delete Produk</button>
                                    </div>

                                    <div className="col-3">
                                        {data.mbr.map((mbr, mbrIndex) => (
                                            <input
                                                key={mbrIndex}
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="No MBR"
                                                value={mbr.no_mbr}
                                                onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'no_mbr', e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        ))}
                                        <button onClick={() => addMBRItem(data.uuid)} className="btn btn-sm btn-success mb-3" disabled={isSubmitting}>Tambah PO/PS</button>
                                    </div>

                                    <div className="col-1">
                                        {data.mbr.map((mbr, mbrIndex) => (
                                            <select
                                                key={mbrIndex}
                                                className="form-select mb-2"
                                                aria-label="Default select example"
                                                value={mbr.tipe_mbr}
                                                onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'tipe_mbr', e.target.value)}
                                                disabled={isSubmitting}
                                            >
                                                <option value="PO">PO</option>
                                                <option value="PS">PS</option>
                                            </select>
                                        ))}
                                    </div>
                                    <div className="col-1">
                                        {data.mbr.map((mbr, mbrIndex) => (
                                            <input
                                                key={mbrIndex}
                                                type="number"
                                                className="form-control mb-2"
                                                placeholder="Jumlah"
                                                value={mbr.jumlah}
                                                onChange={(e) => handleChangeMBR(data.uuid, mbrIndex, 'jumlah', e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        ))}
                                    </div>
                                    <div className="col-1">
                                        {data.mbr.map((_, mbrIndex) => (
                                            <div key={mbrIndex}>
                                                <button onClick={() => handleDeleteMBRItem(index, mbrIndex)} className="btn btn-sm btn-danger mb-3" disabled={isSubmitting}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="row mt-3">
                                <div className="col-auto">
                                    <button onClick={addProduk} className="btn btn-sm btn-primary mx-3" disabled={isSubmitting}>Tambah Produk</button>
                                    <button onClick={submitPermintaan} className="btn btn-sm btn-success" disabled={isSubmitting}>Kirim Ulang Permintaan</button>
                                </div>
                            </div>


                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        onClose()
                    }}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </>
    )
}

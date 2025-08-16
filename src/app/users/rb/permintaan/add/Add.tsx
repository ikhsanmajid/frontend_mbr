"use client";
import { FetchAllProduk, addPermintaanNomor } from "@/app/lib/admin/users/userAPIRequest";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import Select from 'react-select';
import { set } from "zod";

interface IProduk {
    id: number;
    idBagian: number;
    idKategori: number;
    namaProduk: string;
    namaBagian: string;
    namaKategori: string;
    isActive: boolean;
}

interface IPermintaan {
    uuid: string;
    idProduk: number;
    namaProduk: string;
    mbr: {
        no_mbr: string;
        jumlah: number;
        tipe_mbr: string;
    }[];
}

export default function AddPermintaanRB({ session }: { session: string }) {
    const { listProduk, isLoadingListProduk, error: isErrorListProduk } = FetchAllProduk(session);
    // const [produkList, setProdukList] = useState<IProduk[] | null>(null);
    const [produkList, setProdukList] = useState<{ value: number, label: string }[]>([]);
    const [listPermintaan, setListPermintaan] = useState<IPermintaan[] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const router = useRouter();

    //console.log("List Permintaan", listPermintaan);

    useEffect(() => {
        setIsMounted(true);
        toast.dismiss();
    }, []);

    useEffect(() => {
        if (isLoadingListProduk) {
            return;
        };

        if (isErrorListProduk) {
            toast.error("Gagal Memuat Data Produk");
            return;
        }

        if (!isLoadingListProduk && listProduk) {
            setProdukList([]);
            listProduk.data.map((items: any) => {
                if (items.isActive) {
                    setProdukList((prev) => (
                        (prev ? [...prev, { value: items.id, label: items.namaProduk }] : [{ value: items.id, label: items.namaProduk }])
                    ))
                }
            })
        }

        // setProdukList(listProduk.data);
    }, [isLoadingListProduk, isErrorListProduk, listProduk]);

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
        //console.log("Delete MBR Item", listPermintaan);
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
                    namaProduk: namaProduk
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

    useEffect(() => {
        if (listPermintaan?.length == 0 ) {
            setListPermintaan(null);
        }
    }, [listPermintaan])

    async function submitPermintaan() {
        if (!validateInputs()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await addPermintaanNomor(listPermintaan, session);
            if (response.status === "success") {
                toast.success(response.message);
                //console.log("Response Data:", response.data);
                
                setTimeout(() => {
                    router.push("/users/rb/permintaan/list");
                }, 2000);
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
        <div className="card mt-3">
            <div><ToastContainer/></div>
            <div className="card-header">
                <span className="fw-bold">Form Permintaan RB</span>
            </div>
            <div className="card-body">
                {isLoadingListProduk ? <p>Loading...</p> :
                    <>
                        <div className="row">
                            <div className="col-1">
                                No.
                            </div>
                            <div className="col-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Nama Produk</label>
                            </div>
                            <div className="col-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">No Dokumen MBR</label>
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
                                    {isMounted ? <Select className="mb-2" onChange={(e) => handleChangeProduk(data.uuid, e!.value, e!.label)} options={produkList} isSearchable isLoading={isLoadingListProduk} /> : null}
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
                                <button onClick={submitPermintaan} className="btn btn-sm btn-success" disabled={(isSubmitting || listPermintaan == null)}>Kirim Permintaan</button>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
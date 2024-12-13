"use client"
import { Toaster } from "react-hot-toast";
import FilterComponentPengembalian from "./FilterComponent";
import { GetAllReturnRBByProductAndIdPermintaan } from "@/app/lib/admin/users/userAPIRequest";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "react-bootstrap";
import ModalLihat from "./ModalLihat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

export default function ListPengembalianUser({ session, idProduk }: { session: string, idProduk: string }) {
    const searchParams = useSearchParams()
    const idPermintaan = searchParams.get("idPermintaan")
    const [statusKembali, setStatusKembali] = useState<"all" | "belum">("belum")
    const [showModalLihat, setShowModalLihat] = useState(false)
    const [dataLihat, setDataLihat] = useState<any | null>(null)

    const { listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian } = GetAllReturnRBByProductAndIdPermintaan(session, idProduk, idPermintaan, undefined, undefined, { status: statusKembali })

    useEffect(() => {
        toast.dismiss()
    }, [])

    function handleShowModalLihat(data: any) {
        setDataLihat(data)
        setShowModalLihat(true)
    }

    return (
        <>
            <Button onClick={() => window.history.back()} className="mb-1 btn-warning text-white">Kembali</Button>
            <div className="card mt-3">
                <div className="card-header d-flex justify-content-between">
                    <span className="fw-bold">Pengembalian RB Bagian</span>
                    <button className="btn btn-sm btn-primary" onClick={mutateListPengembalian}><FontAwesomeIcon icon={faRefresh} />&nbsp; Refresh</button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <FilterComponentPengembalian statusKembali={(status: "all" | "belum") => setStatusKembali(status)} />
                    </div>

                    <div className="row">
                        {error && <div>{error.message}</div>}
                        {isLoadingListPengembalian && <div>Loading...</div>}
                        <div className="table-responsive">
                            <table className="table table-sm table-striped table-bordered align-middle text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Nama Produk</th>
                                        <th scope="col">No Dokumen MBR</th>
                                        <th scope="col">Tipe MBR</th>
                                        <th scope="col">Tanggal Bulan</th>
                                        <th scope="col">Tahun</th>
                                        <th scope="col">Nomor Awal</th>
                                        <th scope="col">Nomor Akhir</th>
                                        <th scope="col">Jumlah RB Belum Kembali</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {isLoadingListPengembalian && <tr>
                                        <td colSpan={10}>
                                            Loading...
                                        </td>
                                    </tr>}

                                    {!isLoadingListPengembalian && listPengembalian && listPengembalian.data.length === 0 && <tr>
                                        <td colSpan={10}>
                                            Data Kosong
                                        </td>
                                    </tr>}

                                    {!isLoadingListPengembalian && listPengembalian && listPengembalian.data.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.namaProduk}</td>
                                            <td>{item.nomorMBR}</td>
                                            <td>{item.tipeMBR}</td>
                                            <td>{item.tanggalBulan}</td>
                                            <td>{item.tahun}</td>
                                            <td>{item.nomorAwal}</td>
                                            <td>{item.nomorAkhir}</td>
                                            <td>{item.RBBelumKembali}</td>
                                            <td>
                                                <Button onClick={() => handleShowModalLihat(item)} className="btn-sm btn-primary">Lihat</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between px-4 pt-3">
                    <div className="col">

                    </div>
                    <div className="col d-flex justify-content-end align-items-center">
                        {/* <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent> */}
                    </div>
                </div>


                <ModalLihat
                    session={session}
                    show={showModalLihat}
                    data={dataLihat}
                    onClose={() => {
                        setShowModalLihat(false)
                        mutateListPengembalian()
                    }}>
                </ModalLihat>

                {/* {showEditModal && <ModalEdit session={session} show={showEditModal} data={dataLihatEdit} onClose={(message) => {
                if (message) {
                    toast.success(message)
                }
                mutateListPermintaan()
                setShowEditModal(false)
                setDataLihatEdit(null)
            }}></ModalEdit>} */}
            </div>
            <Toaster />
        </>
    )
}
"use client"
import { Button } from "react-bootstrap";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetAllReturnRBAdminByProductAndIdPermintaan } from "@/app/lib/admin/users/userAPIRequest";
import { useFilterState } from "../useFilterState";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FilterComponentPengembalian from "./FilterComponent";
import ModalLihat from "./ModalLihat";

export default function ListPengembalianUser({ idProduk }: { idProduk: string }) {
    const searchParams = useSearchParams()
    const idPermintaan = searchParams.get("idPermintaan")

    const statusKembali = useFilterState(state => state.statusKembali)
    
    const [showModalLihat, setShowModalLihat] = useState(false)
    const [dataLihat, setDataLihat] = useState<any | null>(null)

    const { listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian } = GetAllReturnRBAdminByProductAndIdPermintaan(idProduk, idPermintaan, undefined, undefined, { status: statusKembali })

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
                        {statusKembali && <FilterComponentPengembalian />}
                    </div>

                    <div className="row">
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
                                        {(statusKembali === "outstanding" || statusKembali === "all") && <th scope="col">Jumlah Outstanding</th>}
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {isLoadingListPengembalian && <tr>
                                        <td colSpan={11}>
                                            Loading...
                                        </td>
                                    </tr>}

                                    {!isLoadingListPengembalian && listPengembalian && listPengembalian.data.length === 0 && <tr>
                                        <td colSpan={11}>
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
                                            {(statusKembali === "outstanding" || statusKembali === "all") && <td>{item.JumlahOutstanding}</td>}
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
                    show={showModalLihat}
                    data={dataLihat}
                    onClose={() => {
                        setShowModalLihat(false)
                        mutateListPengembalian()
                    }}>
                </ModalLihat>
            </div>
        </>
    )
}
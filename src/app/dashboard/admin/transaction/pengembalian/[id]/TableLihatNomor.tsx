"use client"
import PaginationComponent from "@/app/component/pagination/Pagination";
import { apiURL, GetAllNomorReturnRBByIDDetailPermintaan } from "@/app/lib/admin/users/userAPIRequest";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";



interface IListNomorRB {
    id: number;
    nomorUrut: string;
    status: string;
    tanggalKembali: string | null;
    namaUserTerima: string | null;
    nomorBatch: string | null;
}

const columnHelper = createColumnHelper<IListNomorRB>()

export default function TableLihatNomor({ session, idData }: { session: string, idData: string | number }) {
    const nomorBatchRef = useRef<HTMLInputElement>(null)
    const [idEdit, setIdEdit] = useState<string | number | null>(null)
    const [editData, setEditData] = useState<IListNomorRB | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [pengembalianNomorData, setPengembalianNomorData] = useState<IListNomorRB[] | null>(null)

    const { listNomorPengembalian, isLoadingListNomorPengembalian, error, mutateListNomorPengembalian } = GetAllNomorReturnRBByIDDetailPermintaan(session, idData, pageSize, pageIndex * pageSize)

    const [show, setShow] = useState(false);
    const [idConfirm, setIdConfirm] = useState<number | null>(null)

    useEffect(() => {
        toast.dismiss()
    }, [])


    function showModalConfirm(id: number) {
        setShow(true)
        setIdConfirm(id)
    }

    async function handleConfirm() {
        setIsLoadingAdd(true)
        try {
            const confirmData = await axios.post(`${apiURL}/admin/product_rb/confirmRBReturnAdmin/${idConfirm}`, {}, {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            })

            if (confirmData.data.status === "success") {
                toast.success("Data berhasil dikonfirmasi")
                mutateListNomorPengembalian()
                setIdConfirm(null)
                setShow(false)
            } else {
                toast.error("Data gagal dikonfirmasi")
            }
        } catch (err) {
            toast.error("Data gagal dikonfirmasi, Backend Error")
        } finally {
            setIsLoadingAdd(false)
        }
    }

    async function handleSave() {
        setIsLoadingAdd(true)
        const dateTime = await axios.get(`${apiURL}/time`)
        const dateUpload = new Date(dateTime.data.time)
        const dateShow = dateUpload.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })

        if (editData?.status === "KEMBALI" && (nomorBatchRef.current?.value === "" || nomorBatchRef.current?.value === null)) {
            toast.error("Nomor Batch harus diisi")
            setIsLoadingAdd(false)
            return
        }

        try {
            const updateData = await axios.put(`${apiURL}/users/rb/updateNomorRBReturn/${idEdit}`, {
                status: editData?.status,
                nomor_batch: nomorBatchRef.current?.value.toUpperCase() ?? "",
                tanggal_kembali: editData?.status === "KEMBALI" || editData?.status === "BATAL" ? dateTime.data.time : ""
            }, {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            })

            if (updateData.data.status === "success") {
                toast.success("Data berhasil diupdate")
                pengembalianNomorData?.map((data) => {
                    if (data.id === idEdit) {
                        data.nomorBatch = nomorBatchRef.current?.value ?? ""
                        data.status = editData!.status
                        if (editData!.status === "KEMBALI" || editData!.status === "BATAL") {
                            data.tanggalKembali = dateShow
                        } else {
                            data.tanggalKembali = null
                        }
                    }
                })
                setIdEdit(null)
            } else {
                toast.error("Data gagal diupdate")
            }
        } catch (err) {
            console.log(err)
        }finally {
            setIsLoadingAdd(false)
        }
    }

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            size: 20,
            enableSorting: false,

        }),
        columnHelper.display({
            header: "Nomor Urut",
            cell: (info) => info.row.original.nomorUrut,
            size: 100,
            enableSorting: false,
        }),
        columnHelper.display({
            header: "Status",
            cell: (info) => {
                if (idEdit === info.row.original.id) {
                    return (
                        <select className="form-select" onChange={(e) => {
                            //console.log(e.target.value)

                            if (e.target.value === "ACTIVE") {
                                setEditData((prev) => { return { ...prev, nomorBatch: "", status: e.target.value, tanggalKembali: null } as IListNomorRB })
                            } else if (e.target.value === "BATAL") {
                                setEditData((prev) => { return { ...prev, nomorBatch: "", status: e.target.value } as IListNomorRB })
                            } else {
                                setEditData((prev) => { return { ...prev, status: e.target.value } as IListNomorRB })
                            }

                            //setEditData({ ...editData, status: e.target.value } as IListNomorRB);
                            //console.log(editData)
                        }} value={editData?.status}>
                            <option value="KEMBALI">Sudah Kembali</option>
                            <option value="ACTIVE">Belum Kembali</option>
                            <option value="BATAL">Batal Digunakan</option>
                        </select>
                    )
                } else {
                    if (info.row.original.status === "KEMBALI") {
                        return "Sudah Kembali"
                    }
                    if (info.row.original.status === "BATAL") {
                        return "Batal Digunakan"
                    }
                    if (info.row.original.status === "ACTIVE") {
                        return "Belum Kembali"
                    }
                }
            },
            size: 100,
            enableSorting: false,
        }),
        columnHelper.display({
            header: "Nomor Batch",
            cell: (info) => {
                if (idEdit === info.row.original.id) {
                    if (editData?.status === "BATAL" || editData?.status === "ACTIVE") {
                        return (
                            <input type="text" name="nomorBatch" className="form-control" disabled />
                        )
                    }

                    return (
                        <input
                            type="text"
                            name="nomorBatch"
                            className="form-control"
                            ref={nomorBatchRef}
                            defaultValue={editData?.nomorBatch ?? ""}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSave()
                                } else if (e.key === "Escape") {
                                    setIdEdit(null)
                                }
                            }}
                            autoComplete="off"
                            disabled={isLoadingAdd}
                        />
                    )
                } else {
                    return info.row.original.nomorBatch
                }
            },
            size: 100,
            enableSorting: false,
        }),
        columnHelper.display({
            header: "Tanggal Kembali",
            cell: (info) => {
                return info.row.original.tanggalKembali
            },
            size: 100,
            enableSorting: false,
        }),
        columnHelper.display({
            header: "Dikonfirmasi Oleh",
            cell: (info) => info.row.original.namaUserTerima,
            size: 100,
            enableSorting: false,
        }),
        columnHelper.display({
            header: "Edit",
            cell: (info) => {
                if (idEdit === info.row.original.id) {
                    return (
                        <>
                            <button className="btn btn-sm btn-danger m-1" onClick={() => {
                                setIdEdit(null)
                            }} disabled={isLoadingAdd}>Cancel</button>
                            <button className="btn btn-sm btn-success m-1" onClick={() => {
                                handleSave()
                            }} disabled={isLoadingAdd}>Save</button>
                        </>
                    )
                } else {
                    if (info.row.original.namaUserTerima !== undefined) {
                        return (
                            <button className="btn btn-sm btn-warning" disabled>Edit</button>
                        )
                    } else {
                        return (<>
                            <button className="btn btn-sm btn-warning m-1" onClick={() => {
                                setIdEdit(info.row.original.id)
                                setEditData(info.row.original)
                            }}>Edit</button>
                            {info.row.original.status !== "ACTIVE" && <button className="btn btn-sm btn-primary" onClick={() => showModalConfirm(info.row.original.id)}>Confirm</button>}
                        </>)
                    }
                }
            },
            size: 100,
            enableSorting: false,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [editData, idEdit])

    const data = useMemo(() => pengembalianNomorData ?? [], [pengembalianNomorData])

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: count,
        autoResetPageIndex: false,
        state: {
            pagination,
        },
    })

    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex

    useEffect(() => {
        if (error) {
            toast.error(error.message)
            return
        }

        if (isLoadingListNomorPengembalian) return

        if (listNomorPengembalian !== null) {
            setCount(listNomorPengembalian.count)
            setPengembalianNomorData(listNomorPengembalian.data)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingListNomorPengembalian, listNomorPengembalian, error])

    useEffect(() => {
        if (currentPage + 1 > pageCount) {
            if (table.getCanPreviousPage()) {
                table.previousPage()
            }
        }
        const pageListTemp = Array.from(Array(pageCount).keys())
        setPageList(pageListTemp)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCount])

    useEffect(() => {
        toast.dismiss()
    }, [])

    return (
        <div className="row">
            <div className="table-responsive">
                <table className="table table-sm table-striped table-bordered align-middle text-center">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} scope="col" style={{ width: `${header.getSize()} px` }}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="table-group-divider">
                        {isLoadingListNomorPengembalian &&
                            <tr>
                                <td colSpan={7} className="text-center"> Loading ....</td>
                            </tr>}

                        {!isLoadingListNomorPengembalian && pengembalianNomorData?.length == 0 &&
                            <tr>
                                <td colSpan={7} className="text-center"> Data Kosong </td>
                            </tr>
                        }

                        {!isLoadingListNomorPengembalian && pengembalianNomorData?.length !== 0 &&
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} style={{ height: `10px` }}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className={cell.column.columnDef.meta?.className ?? ""} style={{ width: `${cell.column.getSize()}px` }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="card-footer d-flex justify-content-between px-4 pt-3">
                <div className="col">
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label className="col-form-label">Data ditampilkan: </label>
                        </div>
                        <div className="col-auto">
                            <select className="form-select"
                                value={table.getState().pagination.pageSize}
                                onChange={e => {
                                    table.setPageSize(Number(e.target.value))
                                }}
                            >
                                {[5, 10, 20, 30].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-auto">
                            <label className="col-form-label">Total Data: {listNomorPengembalian && listNomorPengembalian.count} </label>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                </div>
            </div>
            <Modal
                show={show}
                onHide={() => {
                    setShow(false)
                    setIdConfirm(null)
                }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Peringatan</strong><br />
                    Nomor yang sudah dikonfirmasi tidak dapat diubah lagi
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShow(false)
                        setIdConfirm(null)
                    }} disabled={isLoadingAdd}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirm} disabled={isLoadingAdd}>Confirm</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
"use client"
import { AxiosError } from "axios";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import { GetAllNomorReturnRBByIDDetailPermintaan } from "@/app/lib/admin/users/userAPIRequest";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import api from "@/app/lib/axios";
import PaginationComponent from "@/app/component/pagination/Pagination";

interface IListNomorRB {
    id: number;
    nomorUrut: string;
    status: string;
    tanggalKembali: string | null;
    namaUserTerima: string | null;
    nomorBatch: string | null;
    keterangan: string | null;
}

const columnHelper = createColumnHelper<IListNomorRB>()

export default function TableLihatNomor({ idData }: { idData: string | number }) {
    const nomorBatchRef = useRef<HTMLInputElement>(null)
    const keteranganRef = useRef<HTMLTextAreaElement>(null)
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

    const [searchNumber, setSearchNumber] = useState<string>("")
    const [tempSearchNumber, setTempSearchNumber] = useState<string>("")

    const { listNomorPengembalian, isLoadingListNomorPengembalian, error, mutateListNomorPengembalian } = GetAllNomorReturnRBByIDDetailPermintaan(idData, pageSize, pageIndex * pageSize, { searchNumber: searchNumber })

    async function handleSave() {
        setIsLoadingAdd(true)
        const dateTime = await api.get(`/time`, { apiVersion: "2" })
        const dateUpload = new Date(dateTime.data.time)
        const dateShow = dateUpload.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })

        if (editData?.status === "KEMBALI" && (nomorBatchRef.current?.value === "" || nomorBatchRef.current?.value === null)) {
            toast.error("Nomor Batch harus diisi")
            setIsLoadingAdd(false)
            return
        }

        try {
            const updateData = await api.put(`/users/rb/updateNomorRBReturn/${idEdit}`, {
                status: editData?.status,
                nomor_batch: nomorBatchRef.current?.value ?? "",
                tanggal_kembali: editData?.status === "KEMBALI" || editData?.status === "BATAL" ? dateTime.data.time : "",
                keterangan: keteranganRef.current?.value ?? ""
            })

            if (updateData.data.status === "success") {
                toast.success("Data berhasil diupdate")
                pengembalianNomorData?.map((data) => {
                    if (data.id === idEdit) {
                        data.nomorBatch = nomorBatchRef.current?.value ?? ""
                        data.status = editData!.status
                        data.keterangan = keteranganRef.current?.value ?? ""
                        if (editData!.status === "KEMBALI" || editData!.status === "BATAL") {
                            data.tanggalKembali = dateShow
                        } else {
                            data.tanggalKembali = null
                        }
                    }
                })
                setIdEdit(null)
            }
            
        } catch (err) {

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    window.location.href = "/mbr/login?code=session_expired"
                }
                if (err.response?.status === 400) {
                    toast.error(err.response.data.message, {
                        className: "w-75"
                    })
                }
            }

            //console.log(err)
        } finally {
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
                            if (e.target.value === "ACTIVE") {
                                setEditData((prev) => { return { ...prev, nomorBatch: "", status: e.target.value, tanggalKembali: null } as IListNomorRB })
                            } else if (e.target.value === "BATAL") {
                                setEditData((prev) => { return { ...prev, nomorBatch: "", status: e.target.value } as IListNomorRB })
                            } else {
                                setEditData((prev) => { return { ...prev, status: e.target.value } as IListNomorRB })
                            }
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
            header: "Keterangan",
            cell: (info) => {
                if (idEdit === info.row.original.id) {
                    if (editData?.status === "ACTIVE") {
                        return (
                            <textarea 
                                name="keterangan" 
                                className="form-control" 
                                rows={2}
                                disabled 
                            />
                        )
                    }

                    return (
                        <textarea
                            name="keterangan"
                            className="form-control"
                            rows={2}
                            ref={keteranganRef}
                            defaultValue={info.row.original.keterangan ?? ""}
                            placeholder="Masukkan keterangan..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                    handleSave()
                                } else if (e.key === "Escape") {
                                    setIdEdit(null)
                                }
                            }}
                            disabled={isLoadingAdd}
                        />
                    )
                } else {
                    return (
                        <textarea
                            name="keterangan"
                            className="form-control"
                            rows={2}
                            value={info.row.original.keterangan ?? ""}
                            disabled
                            style={{ resize: 'none', backgroundColor: '#f8f9fa' }}
                        />
                    )
                }
            },
            size: 150,
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
                        return (<button className="btn btn-sm btn-warning" onClick={() => {
                            setIdEdit(info.row.original.id)
                            setEditData(info.row.original)
                        }}>Edit</button>)
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

    // Debounce effect for search (1.5 seconds)
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchNumber(tempSearchNumber)
            // Reset to first page when searching
            if (tempSearchNumber !== searchNumber) {
                setPagination(prev => ({ ...prev, pageIndex: 0 }))
            }
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [tempSearchNumber, searchNumber])

    // Reset search when idData changes
    useEffect(() => {
        setSearchNumber("")
        setTempSearchNumber("")
    }, [idData])

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

    return (
        <>
            {/* Search Input Section */}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body py-3">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-3 col-lg-2">
                            <label className="form-label text-muted fw-medium mb-0">
                                Pencarian Nomor
                            </label>
                        </div>
                        <div className="col-12 col-md-9 col-lg-6">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control border-primary border-opacity-25 ps-3 pe-3"
                                    placeholder="Ketik nomor urut"
                                    value={tempSearchNumber}
                                    onChange={(e) => setTempSearchNumber(e.target.value)}
                                    style={{
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        padding: '0.7rem 1rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                                {tempSearchNumber && tempSearchNumber !== searchNumber && (
                                    <div className="position-absolute top-100 start-0 mt-1">
                                        <small className="text-primary fst-italic">
                                            <span className="spinner-border spinner-border-sm me-1" style={{ width: '0.7rem', height: '0.7rem' }}></span>
                                            Mencari...
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                        {searchNumber && (
                            <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => {
                                        setTempSearchNumber("")
                                        setSearchNumber("")
                                    }}
                                    style={{ borderRadius: '6px' }}
                                >
                                    ✕ Hapus Pencarian
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-hover table-bordered align-middle text-center">
                            <thead className="table-dark">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} scope="col" className="text-white fw-semibold" style={{ minWidth: `${header.getSize()}px` }}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="table-group-divider">
                                {isLoadingListNomorPengembalian &&
                                    <tr>
                                        <td colSpan={8} className="text-center py-4 text-muted fst-italic">
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Loading ...
                                        </td>
                                    </tr>}

                                {!isLoadingListNomorPengembalian && pengembalianNomorData?.length == 0 &&
                                    <tr>
                                        <td colSpan={8} className="text-center py-4 text-muted fst-italic">
                                            <i className="fas fa-inbox me-2"></i>
                                            Data Kosong
                                        </td>
                                    </tr>
                                }

                                {!isLoadingListNomorPengembalian && pengembalianNomorData?.length !== 0 &&
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="table-row-hover">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className={`text-nowrap ${cell.column.columnDef.meta?.className ?? ""}`} style={{ minWidth: `${cell.column.getSize()}px` }}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-lg-6">
                        <div className="row g-2 align-items-center justify-content-center justify-content-lg-start">
                            <div className="col-auto">
                                <small className="text-muted fw-medium">Data per halaman:</small>
                            </div>
                            <div className="col-auto">
                                <select className="form-select form-select-sm"
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
                                <small className="text-muted fw-medium">
                                    Total: <span className="text-primary fw-semibold">{listNomorPengembalian && listNomorPengembalian.count}</span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center">
                        <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                    </div>
                </div>
            </div>
        </>
    );
}
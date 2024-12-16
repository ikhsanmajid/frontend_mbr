"use client"
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetAllReturnRBAdminByProduct } from "@/app/lib/admin/users/userAPIRequest";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import FilterComponentPengembalian from "./FilterComponent";
import Link from "next/link";
import PaginationComponent from "@/app/component/pagination/Pagination";
import { useFilterState } from "./useFilterState";


interface IReturnRB {
    id: number;
    idProduk: number;
    namaProduk: string;
    tanggalBulan: string;
    tahun: string;
    nomorAwal: string;
    nomorAkhir: string;
    RBBelumKembali: number;
    JumlahOutstanding?: number | never | string;
}

const columnHelper = createColumnHelper<IReturnRB>()

export default function ListPengembalianUser({ session }: { session: string }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [pengembalianData, setPengembalianData] = useState<IReturnRB[] | null>(null)

    const [tempFilterNomor, setTempFilterNomor] = useState<string | null>(null)
    const [filterNomor, setFilterNomor] = useState<string | null>(null)
    const idBagian = useFilterState(state => state.idBagian)
    const idProduk = useFilterState(state => state.idProduk)
    const statusKembali = useFilterState(state => state.statusKembali)
    const startDate = useFilterState(state => state.startDate)
    const endDate = useFilterState(state => state.endDate)

    const { listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian } = GetAllReturnRBAdminByProduct(session, idProduk, pageSize, pageIndex * pageSize, { number: filterNomor, status: statusKembali, startDate: startDate, endDate: endDate, idBagian: idBagian })

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            size: 20,
            enableSorting: false,

        }),
        columnHelper.accessor("namaProduk", {
            header: "Nama Produk",
            cell: ({ cell, row }) => <Link href={`pengembalian/${row.original.idProduk == undefined ? idProduk : row.original.idProduk}?idPermintaan=${row.original.id}`}>{cell.getValue()}</Link>,
            size: 180,
            meta: {
                className: "text-start" as any
            }
        }),
        columnHelper.accessor("tanggalBulan", {
            header: "Tanggal Bulan",
            cell: info => info.getValue(),
            size: 50,
        }),
        columnHelper.accessor("tahun", {
            header: "Tahun",
            cell: info => info.getValue(),
            size: 50,
        }),
        columnHelper.accessor("nomorAwal", {
            header: "Nomor Awal",
            cell: info => info.getValue(),
            size: 60,
        }),
        columnHelper.accessor("nomorAkhir", {
            header: "Nomor Akhir",
            cell: info => info.getValue(),
            size: 60,
        }),
        columnHelper.accessor("RBBelumKembali", {
            header: "Jumlah RB Belum Kembali",
            cell: info => info.getValue(),
            size: 100,
        }),
        ...(statusKembali == "outstanding" ? [columnHelper.accessor("JumlahOutstanding", {
            header: "Jumlah Outstanding",
            cell: info => info.getValue(),
            size: 80,
        })] : []),
        //eslint-disable-next-line react-hooks/exhaustive-deps
    ].filter(Boolean), [idProduk, statusKembali])

    const data = useMemo(() => pengembalianData ?? [], [pengembalianData])

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
        toast.dismiss()
    }, [])

    useEffect(() => {
        if (error) {
            if (error.message === "Pilih Produk Terlebih Dahulu") return
            toast.error(error.message)
            return
        }

        if (isLoadingListPengembalian) return

        if (listPengembalian !== null) {
            setCount(listPengembalian.count)
            setPengembalianData(listPengembalian.data)
            //console.log(listPengembalian.data)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingListPengembalian, listPengembalian, error])

    useEffect(() => {
        //console.log("data: ", data)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pengembalianData])

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
        setFilterNomor(null)
        setTempFilterNomor(null)
    }, [idProduk])

    return (
        <>
            <div className="card mt-3">
                <div className="card-header d-flex justify-content-between">
                    <span className="fw-bold">Pengembalian RB Bagian</span>
                    <button className="btn btn-sm btn-primary" onClick={mutateListPengembalian}><FontAwesomeIcon icon={faRefresh} />&nbsp; Refresh</button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <FilterComponentPengembalian
                            session={session}
                        />
                    </div>

                    <div className="row mb-2 mt-1 align-items-center">
                        <div className="col col-1">
                            <span>Cari Nomor: </span>
                        </div>
                        <div className="col col-3">
                            <input type="text" className="form-control" placeholder="Masukkan Nomor" onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setFilterNomor(e.currentTarget.value)
                                    //console.log("value ", e.currentTarget.value)
                                }
                            }} value={tempFilterNomor ?? ""}
                                onChange={(e) => {
                                    setTempFilterNomor(e.currentTarget.value)
                                }} />
                        </div>
                    </div>

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
                                    {isLoadingListPengembalian &&
                                        <tr>
                                            <td colSpan={8} className="text-center"> Loading ....</td>
                                        </tr>}

                                    {!isLoadingListPengembalian && pengembalianData?.length == 0 &&
                                        <tr>
                                            <td colSpan={8} className="text-center"> Data Kosong </td>
                                        </tr>
                                    }

                                    {!isLoadingListPengembalian && pengembalianData?.length !== 0 &&
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
                    </div>
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
                                <label className="col-form-label">Total Data: {listPengembalian && listPengembalian.count} </label>
                            </div>
                        </div>
                    </div>
                    <div className="col d-flex justify-content-end align-items-center">
                        <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                    </div>
                </div>

                {/* {showModalLihat && <ModalLihat session={session} show={showModalLihat} data={dataLihatEdit} onClose={() => {
                setShowModalLihat(false)
                setDataLihatEdit(null)
            }} onSave={mutateListPermintaan}></ModalLihat>}

            {showEditModal && <ModalEdit session={session} show={showEditModal} data={dataLihatEdit} onClose={(message) => {
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
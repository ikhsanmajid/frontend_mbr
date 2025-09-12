"use client"
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetAllReturnRBAdminByProduct } from "@/app/lib/admin/users/userAPIRequest";
import { toast } from 'react-toastify';
import { useEffect } from "react";
import { useFilterState } from "./useFilterState";
import { useMemo, useState } from "react";
import ModalLihat from "./ModalLihat";
import RowActions from "./RowActions";
import FilterComponentPengembalian from "./FilterComponent";
import Link from "next/link";
import PaginationComponent from "@/app/component/pagination/Pagination";


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

export default function ListPengembalianUser() {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [status, setStatus] = useState<boolean>(false)

    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [showModal, setShowModal] = useState<boolean>(false)
    const [idDataLihat, setIdDataLihat] = useState<any | null>(null)

    const [pengembalianData, setPengembalianData] = useState<IReturnRB[] | null>(null)

    const [tempFilterNomor, setTempFilterNomor] = useState<string | null>(null)
    const [filterNomor, setFilterNomor] = useState<string | null>(null)
    const setIdProduk = useFilterState((state) => state.setIdProduk);
    const idBagian = useFilterState(state => state.idBagian)
    const idProduk = useFilterState(state => state.idProduk)
    const statusKembali = useFilterState(state => state.statusKembali)
    const startDate = useFilterState(state => state.startDate)
    const endDate = useFilterState(state => state.endDate)

    //console.log("data: ", idProduk)

    const { listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian } = GetAllReturnRBAdminByProduct(idProduk, pageSize, pageIndex * pageSize, { number: filterNomor, status: statusKembali, startDate: startDate, endDate: endDate, idBagian: idBagian })

    //console.log("Pengembalian Data: ", listPengembalian)

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
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions
                props={props}
                handleShow={(data: IReturnRB) => {
                    setShowModal(true)
                    setIdDataLihat(data)
                    if(statusKembali === "outstanding" && idBagian == null) setIdProduk(data.idProduk)
                }}
            >
            </RowActions>,
            enableSorting: false,
        })
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

        if (listPengembalian.status == "success"){
            setStatus(true)
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
                        <FilterComponentPengembalian />
                    </div>

                    <div className="row mb-3 mt-2">
                        <div className="col-12">
                            <div className="row g-2 align-items-center">
                                <div className="col-12 col-md-2">
                                    <label className="form-label fw-medium mb-0">Cari Nomor:</label>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Masukkan Nomor"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setFilterNomor(e.currentTarget.value)
                                                    //console.log("value ", e.currentTarget.value)
                                                }
                                            }}
                                            value={tempFilterNomor ?? ""}
                                            onChange={(e) => {
                                                setTempFilterNomor(e.currentTarget.value)
                                            }}
                                            disabled={!status}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => {
                                                setFilterNomor(tempFilterNomor)
                                            }}
                                            disabled={!status}
                                        >
                                            <i className="fas fa-search"></i>
                                            <span className="d-none d-sm-inline ms-1">Cari</span>
                                        </button>
                                    </div>
                                </div>

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
                                        {isLoadingListPengembalian &&
                                            <tr>
                                                <td colSpan={8} className="text-center py-4 text-muted fst-italic">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    Loading ...
                                                </td>
                                            </tr>}

                                        {!isLoadingListPengembalian && pengembalianData?.length == 0 &&
                                            <tr>
                                                <td colSpan={8} className="text-center py-4 text-muted fst-italic">
                                                    <i className="fas fa-inbox me-2"></i>
                                                    Data Kosong
                                                </td>
                                            </tr>
                                        }

                                        {!isLoadingListPengembalian && pengembalianData?.length !== 0 &&
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
                                        Total: <span className="text-primary fw-semibold">{listPengembalian && listPengembalian.count}</span>
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center">
                            <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                        </div>
                    </div>
                </div>

                {idDataLihat !== null && <ModalLihat
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                        setIdDataLihat(null)
                    }}
                    data={idDataLihat}>

                </ModalLihat>}
            </div>
        </>
    )
}
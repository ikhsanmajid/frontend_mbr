"use client";
import { faRefresh, faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetPermintaanRB } from "@/app/lib/admin/users/userAPIRequest";
import { toast } from 'react-toastify'
import { useFilterState } from "./useFilterState";
import { useState, useMemo, useEffect } from "react";
import FilterComponentPermintaan from "./FilterComponent";
import ModalEdit from "./ModalEdit";
import ModalLihat from "./ModalLihat";
import PaginationComponent from "@/app/component/pagination/Pagination";
import React from "react";
import RowActions from "./RowActions";
import { useSorting } from "@/app/lib/useSorting";

export interface IPermintaan {
    id: number | string;
    idCreated?: number;
    namaCreated: string;
    nikCreated: string;
    idBagianCreated?: number;
    namaBagianCreated?: string;
    timeCreated?: string;
    idConfirmed?: number;
    namaConfirmed?: string;
    timeConfirmed?: string;
    status?: string;
    reason?: string;
    used?: boolean | number;
}

const columnHelper = createColumnHelper<IPermintaan>()

export default function ListMBR() {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const { sorting, onSortingChange, order, field } = useSorting("createdAt", "DESC")

    const [usersData, setUsersData] = useState<IPermintaan[] | null>(null)

    const [showEditModal, setShowEditModal] = useState<boolean>(false)

    const [showModalLihat, setShowModalLihat] = useState<boolean>(false)
    const [dataLihatEdit, setDataLihatEdit] = useState<IPermintaan | null>(null)

    //Filter
    const idProduk = useFilterState((state) => state.idProduk)
    const NIKNama = useFilterState((state) => state.NIKNama)
    const StatusKonfirmasi = useFilterState((state) => state.StatusKonfirmasi)
    const StatusDipakai = useFilterState((state) => state.StatusDipakai)
    const filterYear = useFilterState(state => state.filterYear)

    const { listPermintaan, isLoadingListPermintaan, error: errorPermintaan, mutateListPermintaan } = GetPermintaanRB(pageSize, pageIndex * pageSize, { status: StatusKonfirmasi, used: StatusDipakai, keyword: NIKNama, idProduk: idProduk, year: filterYear }, { field: field, order: order })


    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            size: 20,
            enableSorting: false,

        }),
        columnHelper.accessor("id", {
            header: "ID Transaksi",
            cell: info => info.getValue(),
            size: 20,
        }),
        columnHelper.accessor("nikCreated", {
            header: "NIK Pembuat",
            size: 40,
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor("namaCreated", {
            header: "Nama Pembuat",
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor("namaBagianCreated", {
            header: "Nama Bagian Pembuat",
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor("timeCreated", {
            header: "Waktu Dibuat",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("status", {
            header: "Status Konfirmasi",
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions
                props={props}
                showLihatModal={(data) => {
                    setDataLihatEdit(data)
                    setShowModalLihat(true)
                }
                }
                showEditModal={(data) => {
                    setDataLihatEdit(data)
                    setShowEditModal(true)
                }
                }
            >
            </RowActions>,
            enableSorting: false,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [])

    const data = useMemo(() => usersData ?? [], [usersData])

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        manualSorting: true,
        onSortingChange: onSortingChange,
        rowCount: count,
        autoResetPageIndex: false,
        state: {
            pagination,
            sorting
        },
    })

    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex

    useEffect(() => {
        if (errorPermintaan) {
            toast.error("Gagal Memuat Data")
            return
        }

        if (isLoadingListPermintaan) return

        if (listPermintaan !== null) {
            setUsersData(listPermintaan.data)
            setCount(listPermintaan.count)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingListPermintaan])

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
            <div className="card mt-3">
                <div className="card-header d-flex justify-content-between">
                    <span className="fw-bold">Daftar Permintaan</span>
                    <button className="btn btn-sm btn-primary" onClick={mutateListPermintaan}><FontAwesomeIcon icon={faRefresh} />&nbsp; Refresh</button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <FilterComponentPermintaan />
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-hover table-bordered align-middle text-center">
                                    <thead className="table-dark">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <th key={header.id} scope="col" className="text-white fw-semibold" style={{ minWidth: `${header.getSize()}px` }} {...(header.column.getCanSort() ? { onClick: header.column.getToggleSortingHandler() } : {})}>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}

                                                        {header.column.getIsSorted() === "asc" ? (<span> <FontAwesomeIcon className="ms-1" icon={faSortUp} /></span>) : header.column.getIsSorted() === "desc" ? (<span> <FontAwesomeIcon className="ms-1" icon={faSortDown} /></span>) : header.column.getCanSort() ? (<span> <FontAwesomeIcon className="ms-1" icon={faSort} /></span>) : ""}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {isLoadingListPermintaan &&
                                            <tr>
                                                <td colSpan={8} className="text-center py-4 text-muted fst-italic">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    Loading ...
                                                </td>
                                            </tr>}

                                        {(!isLoadingListPermintaan && listPermintaan != null && listPermintaan.count == 0) ?
                                            <tr>
                                                <td colSpan={8} className="text-center py-4 text-muted fst-italic">
                                                    <i className="fas fa-inbox me-2"></i>
                                                    Data Kosong
                                                </td>
                                            </tr> :
                                            !isLoadingListPermintaan && table.getRowModel().rows.map(row => (
                                                <tr key={row.id} className="table-row-hover">
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td key={cell.id} className="text-nowrap" style={{ minWidth: `${cell.column.getSize()}px` }}>
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
                                        Total: <span className="text-primary fw-semibold">{listPermintaan && listPermintaan.count}</span>
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center">
                            <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                        </div>
                    </div>
                </div>

                {showModalLihat && <ModalLihat show={showModalLihat} data={dataLihatEdit} onClose={() => {
                    setShowModalLihat(false)
                    setDataLihatEdit(null)
                }} onSave={mutateListPermintaan}></ModalLihat>}

                {showEditModal && <ModalEdit show={showEditModal} data={dataLihatEdit} onClose={(message) => {
                    if (message) {
                        toast.success(message)
                    }
                    mutateListPermintaan()
                    setShowEditModal(false)
                    setDataLihatEdit(null)
                }}></ModalEdit>}
            </div>
        </>
    )
}
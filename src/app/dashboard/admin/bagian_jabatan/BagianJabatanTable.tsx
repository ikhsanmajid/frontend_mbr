"use client"
import { Button } from "react-bootstrap"
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from "react"
import { useGetAllBagianJabatan } from "@/app/lib/admin/users/userAPIRequest"
import ModalEdit from "./ModalEdit"
import RowActions from "./RowActions"
import ModalDelete from "./ModalDelete"
import PaginationComponent from "@/app/component/pagination/Pagination"

export interface IBagianJabatan {
    id: number
    idBagianFK: {
        id: number
        namaBagian: string
    }
    idJabatanFK: {
        id: number
        namaJabatan: string
    }
}

const columnHelper = createColumnHelper<IBagianJabatan>()


export default function BagianJabatanTable({ session, onAdd, mutate }: { session: string, onAdd: (state: boolean) => void, mutate: (mutateFn: VoidFunction) => void }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [jabatanData, _setBagianData] = useState<IBagianJabatan[] | null>(null)

    const [showModalEdit, _setShowModalEdit] = useState<boolean>(false)
    const [dataEdit, _setDataEdit] = useState<IBagianJabatan | null>(null)

    const [showModalDelete, _setShowModalDelete] = useState<boolean>(false)
    const [dataDelete, _setDataDelete] = useState<IBagianJabatan | null>(null)

    const { detailBagianJabatan, isLoadingBagianJabatan, error, mutateBagianJabatan } = useGetAllBagianJabatan(session, pageSize, pageIndex * pageSize, "asc");

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            enableSorting: false,
            size: 20

        }),
        columnHelper.accessor("idBagianFK.namaBagian", {
            header: "Nama Bagian",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("idJabatanFK.namaJabatan", {
            header: "Nama Jabatan",
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions props={props} handleEdit={(data: IBagianJabatan) => handleEdit(data)} handleDelete={(data: IBagianJabatan) => handleDelete(data)}></RowActions>,
            size: 40
        }),
    ], [])


    const data = useMemo(() => jabatanData ?? [], [jabatanData])

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
        if (!isLoadingBagianJabatan) {
            _setBagianData(detailBagianJabatan.data)
            setCount(detailBagianJabatan.count)
            mutate(mutateBagianJabatan)
        }

        if (table.getState().pagination.pageIndex + 1 > pageCount) {
            if (table.getCanPreviousPage()) {
                table.previousPage()
            }
        }
        
        const pageListTemp = Array.from(Array(pageCount).keys())
        setPageList(pageListTemp)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingBagianJabatan, pageCount])


    const handleEdit = (data: IBagianJabatan) => {
        _setShowModalEdit(true)
        _setDataEdit(data)
    }

    const handleDelete = (data: IBagianJabatan) => {
        _setShowModalDelete(true)
        _setDataDelete(data)
    }

    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                <>Daftar Bagian vs Jabatan</>
                <><button className="btn btn-sm btn-success" onClick={
                    () => { onAdd(true) }
                }>Tambah Bagian vs Jabatan</button></>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-sm table-striped table-bordered align-middle text-center">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} scope="col" style={{ width: `${header.getSize()}px` }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="table-group-divider">
                            {isLoadingBagianJabatan ? <tr>
                                <td colSpan={4} className="text-center"> Loading ....</td>
                            </tr> : ""}
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                            <label className="col-form-label">Total Data: {detailBagianJabatan && detailBagianJabatan.count} </label>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                </div>
            </div>

            <ModalEdit show={showModalEdit} onClose={() => { _setShowModalEdit(false); _setDataEdit(null) }} editData={dataEdit} mutate={mutateBagianJabatan}></ModalEdit>
            <ModalDelete show={showModalDelete} onClose={() => { _setShowModalDelete(false); _setDataDelete(null) }} deleteData={dataDelete} mutate={mutateBagianJabatan}></ModalDelete>
        </div>
    )
}
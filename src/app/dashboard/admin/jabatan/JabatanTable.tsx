"use client"
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from '@tanstack/react-table'
import { useGetAllJabatan } from "@/app/lib/admin/users/userAPIRequest"
import { useMemo, useState, useEffect } from "react"
import ModalDelete from "./ModalDelete"
import ModalEdit from "./ModalEdit"
import RowActions from "./RowActions"
import PaginationComponent from "@/app/component/pagination/Pagination"

export type Jabatan = {
    id: number,
    namaJabatan: string,
    isActive: boolean
}

const columnHelper = createColumnHelper<Jabatan>()


export default function JabatanTable({ onAdd, mutate }: { onAdd: (state: boolean) => void, mutate: (mutate: VoidFunction) => void }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [jabatanData, _setBagianData] = useState<Jabatan[] | null>(null)

    const [showModalEdit, _setShowModalEdit] = useState<boolean>(false)
    const [dataEdit, _setDataEdit] = useState<Jabatan | null>(null)

    const [showModalDelete, _setShowModalDelete] = useState<boolean>(false)
    const [dataDelete, _setDataDelete] = useState<Jabatan | null>(null)

    const { detailJabatan, isLoadingJabatan, error, mutateJabatan } = useGetAllJabatan(pageSize, pageIndex * pageSize);

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            enableSorting: false,
            size: 20

        }),
        columnHelper.accessor("namaJabatan", {
            header: "Nama Jabatan",
            cell: info => info.getValue(),
            meta: {
                className: "text-start"
            }
        }),
        columnHelper.accessor("isActive", {
            header: "Aktif",
            cell: info => <input className="form-check-input" type="checkbox" checked={info.cell.getValue() == true ? true : false} id="flexCheckDefault" disabled></input>,
            size: 20
        }),
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions props={props} handleEdit={(data: Jabatan) => handleEdit(data)} handleDelete={(data: Jabatan) => handleDelete(data)}></RowActions>,
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
        if (!isLoadingJabatan) {
            _setBagianData(detailJabatan.data)
            setCount(detailJabatan.count)
            mutate(mutateJabatan)
        }

        if (table.getState().pagination.pageIndex + 1 > pageCount) {
            if (table.getCanPreviousPage()) {
                table.previousPage()

            }
        }

        const pageListTemp = Array.from(Array(pageCount).keys())
        setPageList(pageListTemp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingJabatan, pageCount])


    const handleEdit = (data: Jabatan) => {
        _setShowModalEdit(true)
        _setDataEdit(data)
    }

    const handleDelete = (data: Jabatan) => {
        _setShowModalDelete(true)
        _setDataDelete(data)
    }

    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                <>Daftar Jabatan</>
                <><button className="btn btn-sm btn-success" onClick={
                    () => { onAdd(true) }
                }>Tambah Jabatan</button></>
            </div>
            <div className="card-body">
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
                                    {isLoadingJabatan ? 
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-muted fst-italic">
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                Loading ...
                                            </td>
                                        </tr> : ""
                                    }
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="table-row-hover">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className={`text-nowrap ${cell.column.columnDef.meta?.className || 'text-center'}`} style={{ minWidth: `${cell.column.getSize()}px` }}>
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
                                    Total: <span className="text-primary fw-semibold">{detailJabatan && detailJabatan.count}</span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center">
                        <PaginationComponent table={table} pageCount={pageCount} currentPage={currentPage} pageList={pageList}></PaginationComponent>
                    </div>
                </div>
            </div>

            <ModalEdit show={showModalEdit} onClose={() => { _setShowModalEdit(false); _setDataEdit(null) }} editData={dataEdit} mutate={mutateJabatan}></ModalEdit>
            <ModalDelete show={showModalDelete}  onClose={() => { _setShowModalDelete(false); _setDataDelete(null) }} deleteData={dataDelete} mutate={mutateJabatan}></ModalDelete>
        </div >
    )
}
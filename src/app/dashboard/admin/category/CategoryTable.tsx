"use client"
import { ICategory } from './ListCategory'
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from "react"
import { FetchAllKategori } from "@/app/lib/admin/users/userAPIRequest"
import ModalEdit from './ModalEdit'
import RowActions from "./RowActions"
import ModalDelete from "./ModalDelete"
import PaginationComponent from "@/app/component/pagination/Pagination"

const columnHelper = createColumnHelper<ICategory>()


export default function CategoryTable({ session, onAdd, mutate }: { session: string, onAdd: (state: boolean) => void, mutate: (mutate: any) => void }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [searchData, setSearchData] = useState<string>("")
    const inputSearch = useRef<HTMLInputElement>(null)

    const [categoryData, setCategoryData] = useState<ICategory[] | null>(null)

    const [showModalEdit, setShowModalEdit] = useState<boolean>(false)
    const [dataEdit, setDataEdit] = useState<ICategory | null>(null)

    const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
    const [dataDelete, setDataDelete] = useState<ICategory | null>(null)

    const { detailKategori, isLoadingKategori, mutateListKategori } = FetchAllKategori(session, pageSize, pageIndex * pageSize, { search_kategori: searchData })

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            enableSorting: false,
            size: 20

        }),
        columnHelper.accessor("namaKategori", {
            header: "Nama Kategori",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("startingNumber", {
            header: "Awal Nomor Urut",
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions props={props} handleEdit={(data: ICategory) => handleEdit(data)} handleDelete={(data: ICategory) => handleDelete(data)}></RowActions>,
            size: 40
        }),
    ], [])


    const data = useMemo(() => categoryData ?? [], [categoryData])

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
        if (!isLoadingKategori) {
            setCategoryData(detailKategori.data)
            setCount(detailKategori.count)
            mutate(mutateListKategori)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingKategori])

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



    const handleEdit = (data: ICategory) => {
        setShowModalEdit(true)
        setDataEdit(data)
    }

    const handleDelete = (data: ICategory) => {
        setShowModalDelete(true)
        setDataDelete(data)
    }

    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                Daftar Kategori
                <button className="btn btn-sm btn-success" onClick={
                    () => { onAdd(true) }
                }>Tambah Kategori</button>
            </div>
            <div className="card-body">

                <div className="row mb-2 w-50">
                    <div className="col-sm-3">
                        <label htmlFor="inputSearchKategori" className="col-form-label">Search Kategori: </label>
                    </div>

                    <div className="col-sm-4">
                        <input ref={inputSearch} type="text" autoComplete="off" className="form-control" id="inputSearchKategori" />
                    </div>
                    <div className="col-sm-1">
                        <button onClick={(e) => {
                            e.preventDefault()
                            setSearchData(inputSearch.current!.value)
                        }} className="btn btn-md btn-primary text-white">Cari</button>
                    </div>
                </div>

                <div className="row">
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
                                {isLoadingKategori &&
                                    <tr>
                                        <td colSpan={4} className="text-center"> Loading ....</td>
                                    </tr>}

                                {(!isLoadingKategori && detailKategori.count == 0) ?
                                    <tr>
                                        <td colSpan={4} className="text-center"> Data Kosong </td>
                                    </tr> :
                                    table.getRowModel().rows.map(row => (
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
                            <label className="col-form-label">Total Data: {detailKategori && detailKategori.count} </label>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                </div>
            </div>

            <ModalEdit show={showModalEdit} onClose={() => { setShowModalEdit(false); setDataEdit(null) }} editData={dataEdit} kategoriMutate={mutateListKategori}></ModalEdit>
            <ModalDelete show={showModalDelete} onClose={() => { setShowModalDelete(false); setDataDelete(null) }} deleteData={dataDelete} kategoriMutate={mutateListKategori}></ModalDelete>
        </div >
    )
}
"use client"
import { IBagian } from "../bagian/ListBagian"
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from "react"
import { useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest"
import ModalEdit from "./ModalEdit"
import RowActions from "./RowActions"
import ModalDelete from "./ModalDelete"
import PaginationComponent from "@/app/component/pagination/Pagination"

const columnHelper = createColumnHelper<IBagian>()


export default function BagianTable({ session, onAdd, mutate }: { session: string, onAdd: (state: boolean) => void, mutate: (mutate: any) => void }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [searchData, setSearchData] = useState<string>("")
    const inputSearch = useRef<HTMLInputElement>(null)

    const [bagianData, setBagianData] = useState<IBagian[] | null>(null)

    const [showModalEdit, setShowModalEdit] = useState<boolean>(false)
    const [dataEdit, setDataEdit] = useState<IBagian | null>(null)

    const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
    const [dataDelete, setDataDelete] = useState<IBagian | null>(null)

    const { detailBagian, isLoadingBagian, error, mutateBagian } = useGetAllBagian(session, pageSize, pageIndex * pageSize, { search: searchData })

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            enableSorting: false,
            size: 20

        }),
        columnHelper.accessor("namaBagian", {
            header: "Nama Bagian",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("isActive", {
            header: "Aktif",
            cell: info => <input className="form-check-input" type="checkbox" checked={info.cell.getValue() == true ? true : false} id="flexCheckDefault" disabled></input>,
            size: 20
        }),
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions props={props} handleEdit={(data: IBagian) => handleEdit(data)} handleDelete={(data: IBagian) => handleDelete(data)}></RowActions>,
            size: 40
        }),
    ], [])


    const data = useMemo(() => bagianData ?? [], [bagianData])

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
        if (!isLoadingBagian) {
            setBagianData(detailBagian.data)
            setCount(detailBagian.count)
            mutate(mutateBagian)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingBagian])

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

        

    const handleEdit = (data: IBagian) => {
        setShowModalEdit(true)
        setDataEdit(data)
    }

    const handleDelete = (data: IBagian) => {
        setShowModalDelete(true)
        setDataDelete(data)
    }

    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                Daftar Bagian
                <button className="btn btn-sm btn-success" onClick={
                    () => { onAdd(true) }
                }>Tambah Bagian</button>
            </div>
            <div className="card-body">

                <div className="row mb-2">
                    <label htmlFor="inputSearchBagian" className="col-sm-1 col-form-label">Search Bagian: </label>
                    <div className="col-sm-2">
                        <input ref={inputSearch} type="text" autoComplete="off" className="form-control" id="inputSearchBagian" />
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
                                {isLoadingBagian &&
                                    <tr>
                                        <td colSpan={4} className="text-center"> Loading ....</td>
                                    </tr>}

                                {(!isLoadingBagian && detailBagian.count == 0) ?
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
                            <label className="col-form-label">Total Data: {detailBagian && detailBagian.count} </label>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                </div>
            </div>

            <ModalEdit show={showModalEdit} session={session} onClose={() => { setShowModalEdit(false); setDataEdit(null) }} editData={dataEdit} bagianMutate={mutateBagian}></ModalEdit>
            <ModalDelete show={showModalDelete} session={session} onClose={() => { setShowModalDelete(false); setDataDelete(null) }} deleteData={dataDelete} bagianMutate={mutateBagian}></ModalDelete>
        </div >
    )
}
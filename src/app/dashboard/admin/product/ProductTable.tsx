"use client"
import { FetchAllProduk } from "@/app/lib/admin/users/userAPIRequest"
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from '@tanstack/react-table'
import { IProduct } from './ListProduct'
import { useMemo, useState, useEffect } from "react"
import FilterComponentProduct from './FilterComponent'
import ModalDelete from "./ModalDelete"
import ModalEdit from "./ModalEdit"
import PaginationComponent from "@/app/component/pagination/Pagination"
import RowActions from './RowActions'

const columnHelper = createColumnHelper<IProduct>()


export default function JabatanTable({ session, onAdd, mutate }: { session: string, onAdd: (state: boolean) => void, mutate: (mutate: VoidFunction) => void }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [productData, setProductData] = useState<IProduct[] | null>(null)

    const [showModalEdit, _setShowModalEdit] = useState<boolean>(false)
    const [dataEdit, _setDataEdit] = useState<IProduct | null>(null)

    const [showModalDelete, _setShowModalDelete] = useState<boolean>(false)
    const [dataDelete, _setDataDelete] = useState<IProduct | null>(null)

    // search 
    const [searchProduct, setSearchProduct] = useState<string>("")
    const [searchBagian, setSearchBagian] = useState<string>("")
    const [searchStatus, setSearchStatus] = useState<string>("")

    //console.log("data", searchProduct, searchBagian, searchStatus)

    const { listProduk, isLoadingListProduk, error, mutateListProduk } = FetchAllProduk(session, pageSize, pageIndex * pageSize, { nama_produk: searchProduct, id_bagian: searchBagian, status: searchStatus });

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            enableSorting: false,
            size: 20

        }),
        columnHelper.accessor("namaProduk", {
            header: "Nama Produk",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("namaBagian", {
            header: "Nama Bagian",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("namaKategori", {
            header: "Nama Kategori",
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
            cell: props => <RowActions props={props} handleEdit={(data: IProduct) => handleEdit(data)} handleDelete={(data: IProduct) => handleDelete(data)}></RowActions>,
            size: 40
        }),
    ], [])


    const data = useMemo(() => productData ?? [], [productData])


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
        if (!isLoadingListProduk && listProduk) {
            setProductData(listProduk.data)
            setCount(listProduk.count)
            mutate(mutateListProduk)
        }

        if (table.getState().pagination.pageIndex + 1 > pageCount) {
            if (table.getCanPreviousPage()) {
                table.previousPage()

            }
        }

        const pageListTemp = Array.from(Array(pageCount).keys())
        setPageList(pageListTemp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingListProduk, pageCount])


    const handleEdit = (data: IProduct) => {
        _setShowModalEdit(true)
        _setDataEdit(data)
    }

    const handleDelete = (data: IProduct) => {
        _setShowModalDelete(true)
        _setDataDelete(data)
    }

    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                <>Daftar Produk</>
                <><button className="btn btn-sm btn-success" onClick={
                    () => { onAdd(true) }
                }>Tambah Produk</button></>
            </div>
            <div className="card-body">
                <FilterComponentProduct valueNamaProduk={(namaProduk: string) => setSearchProduct(namaProduk)} valueBagian={(idBagian: string) => setSearchBagian(idBagian) } statusProduct={(status: string) => setSearchStatus(status) } session={session}></FilterComponentProduct>

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
                                {
                                    !isLoadingListProduk && (listProduk?.count == 0 || listProduk == null) &&
                                    <tr>
                                        <td colSpan={6} className="text-center">Data Kosong</td>
                                    </tr>
                                }
                                {isLoadingListProduk ? <tr>
                                    <td colSpan={6} className="text-center"> Loading ....</td>
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

            </div>

            <div className="card-footer d-flex justify-content-between px-4 pt-3">
                <div className="col w-50">
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
                            <label className="col-form-label">Total Data: {listProduk && listProduk.count} </label>
                        </div>
                    </div>
                </div>
                <div className="col w-50 d-flex justify-content-end align-items-center">
                    <PaginationComponent table={table} pageCount={pageCount} currentPage={currentPage} pageList={pageList}></PaginationComponent>
                </div>
            </div>

            <ModalEdit show={showModalEdit} session={session} onClose={() => { _setShowModalEdit(false); _setDataEdit(null) }} editData={dataEdit} mutate={mutateListProduk}></ModalEdit>
            <ModalDelete show={showModalDelete} session={session} onClose={() => { _setShowModalDelete(false); _setDataDelete(null) }} deleteData={dataDelete} mutate={mutateListProduk}></ModalDelete>
        </div >
    )
}
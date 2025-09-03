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


export default function JabatanTable({ onAdd, onAddCSV, mutate }: { onAdd: (state: boolean) => void, onAddCSV: (state: boolean) => void, mutate: (mutate: VoidFunction) => void }) {
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

    const { listProduk, isLoadingListProduk, error, mutateListProduk } = FetchAllProduk(pageSize, pageIndex * pageSize, { nama_produk: searchProduct, id_bagian: searchBagian, status: searchStatus });

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
            meta: {
                className: "text-start"
            }
        }),
        columnHelper.accessor("namaBagian", {
            header: "Nama Bagian",
            cell: info => info.getValue(),
            meta: {
                className: "text-start"
            }
        }),
        columnHelper.accessor("namaKategori", {
            header: "Nama Kategori",
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
                <div>Daftar Produk</div>
                <div>
                    <button className="btn btn-sm btn-success me-2" onClick={
                        () => { onAddCSV(true) }
                    }>Import Produk CSV</button>
                    <button className="btn btn-sm btn-success" onClick={
                        () => { onAdd(true) }
                    }>Tambah Produk</button>
                </div>
            </div>
            <div className="card-body">
                <FilterComponentProduct valueNamaProduk={(namaProduk: string) => setSearchProduct(namaProduk)} valueBagian={(idBagian: string) => setSearchBagian(idBagian)} statusProduct={(status: string) => setSearchStatus(status)}></FilterComponentProduct>

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
                                    {
                                        !isLoadingListProduk && (listProduk?.count == 0 || listProduk == null) &&
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-muted fst-italic">
                                                <i className="fas fa-inbox me-2"></i>
                                                Data Kosong
                                            </td>
                                        </tr>
                                    }
                                    {isLoadingListProduk ?
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-muted fst-italic">
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
                                    Total: <span className="text-primary fw-semibold">{listProduk && listProduk.count}</span>
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center">
                        <PaginationComponent table={table} pageCount={pageCount} currentPage={currentPage} pageList={pageList}></PaginationComponent>
                    </div>
                </div>
            </div>

            <ModalEdit show={showModalEdit} onClose={() => { _setShowModalEdit(false); _setDataEdit(null) }} editData={dataEdit} mutate={mutateListProduk}></ModalEdit>
            <ModalDelete show={showModalDelete} onClose={() => { _setShowModalDelete(false); _setDataDelete(null) }} deleteData={dataDelete} mutate={mutateListProduk}></ModalDelete>
        </div >
    )
}
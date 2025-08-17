import React from "react";
import { IUser } from "./ListUsers";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import { useState, useMemo, useEffect, useRef } from "react";
import { FetchAllUser } from "@/app/lib/admin/users/userAPIRequest";
import PaginationComponent from "@/app/component/pagination/Pagination";
import ModalDelete from "./ModalDelete";
import RowActions from "./RowActions";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import FilterComponentUser from "./FilterComponent";

const columnHelper = createColumnHelper<IUser>()

export default function UserTable({ mutateUsers, onAdd }: { mutateUsers: (mutate: VoidFunction) => void, onAdd: (state: boolean) => void }) {
    const [count, setCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { pageIndex, pageSize } = pagination
    const [pageList, setPageList] = useState<Array<number>>([])

    const [usersData, setUsersData] = useState<IUser[] | null>(null)

    const router = useRouter()

    const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
    const [dataDelete, setDataDelete] = useState<IUser | null>(null)

    //Filter
    const [searchUser, setSearchUser] = useState<string>("")
    const [statusUser, setStatusUser] = useState<string>("all")

    const { listUser, isLoadingUser, error: errorUser, mutateUser } = FetchAllUser(pageSize, pageIndex * pageSize, { search_user: searchUser, active: statusUser })

    const handleEdit = (data: number | null) => {
        if (data == null) {
            return toast.error("Data ID Kosong")
        }
        return router.push(`users/edit/${data}`)
    }

    const handleDelete = (data: IUser) => {
        setShowModalDelete(true)
        setDataDelete(data)
    }

    const columns = useMemo(() => [
        columnHelper.display({
            header: "No",
            cell: (info) => info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1,
            enableSorting: false,
            size: 20

        }),
        columnHelper.accessor("nik", {
            header: "NIK",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("nama", {
            header: "Nama",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("isActive", {
            header: "Status Aktif",
            cell: info => <input className="form-check-input" type="checkbox" checked={info.cell.getValue() == true ? true : false} id="flexCheckDefault" disabled></input>,
        }),
        columnHelper.accessor("isAdmin", {
            header: "Status Administrator",
            cell: info => <input className="form-check-input" type="checkbox" checked={info.cell.getValue() == true ? true : false} id="flexCheckDefault" disabled></input>,
        }),
        columnHelper.display({
            header: "Actions",
            id: "actions",
            cell: props => <RowActions
                props={props}
                handleEdit={(data: IUser) => handleEdit(data.id == undefined ? null : data.id)}
                handleDelete={(data: IUser) => handleDelete(data)}>
            </RowActions>,
        }),
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
        rowCount: count,
        autoResetPageIndex: false,
        state: {
            pagination,
        },
    })

    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex

    useEffect(() => {
        if (errorUser) {
            toast.error("Gagal Memuat Data")
            return
        }

        if (isLoadingUser) return

        if (listUser !== null) {
            setUsersData(listUser.data)
            setCount(listUser.count)
            mutateUsers(mutateUser)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingUser])

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
        mutateUser()
        //eslint-disable-next-line
    }, [])


    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                <span className="fw-bold">Daftar User</span>
                <button className="btn btn-sm btn-success" onClick={
                    () => { onAdd(true) }
                }>Tambah User</button>
            </div>
            <div className="card-body">

                <FilterComponentUser
                    valueBagian={(value: string) => {
                        setSearchUser(value)
                    }}
                    statusUser={(value: string) => {
                        setStatusUser(value)
                    }}>
                </FilterComponentUser>



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
                                {isLoadingUser &&
                                    <tr>
                                        <td colSpan={7} className="text-center"> Loading ....</td>
                                    </tr>}

                                {(!isLoadingUser && listUser != null && listUser.count == 0) ?
                                    <tr>
                                        <td colSpan={7} className="text-center"> Data Kosong </td>
                                    </tr> :
                                    !isLoadingUser && table.getRowModel().rows.map(row => (
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
                            <label className="col-form-label">Total Data: {listUser && listUser.count} </label>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <PaginationComponent table={table} currentPage={currentPage} pageCount={pageCount} pageList={pageList}></PaginationComponent>
                </div>
            </div>

            <ModalDelete show={showModalDelete} onClose={() => { setShowModalDelete(false); setDataDelete(null) }} deleteData={dataDelete} usersMutate={mutateUser}></ModalDelete>
        </div >
    )
}
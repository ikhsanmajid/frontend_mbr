"use client"
import { faAngleLeft, faBan, faPlus, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faPenToSquare, faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { addBagianJabatan, apiURL, checkEmail, deleteBagianJabatanUser, GetDetailUserInfo, GetJabatanByIDBagian, updateDataUser, updateDataUserBagianJabatan, useGetAllBagian } from '@/app/lib/admin/users/userAPIRequest'
import { Image } from "react-bootstrap"
import { useRouter } from 'next/navigation'
import { z, ZodIssue } from "zod"
import toast, { Toaster } from 'react-hot-toast'
import axios, { AxiosError } from 'axios'
import { IBagian } from '../../../bagian/ListBagian'
import { Modal, Button } from 'react-bootstrap'

type JabatanType = {
    id: number
    idJabatanFK: {
        id: number
        namaJabatan: string
    }
}

type DetailUserType = {
    data: {
        bagianjabatan: [{
            idBagianJabatan: number
            idBagianJabatanKey: number
            bagianJabatan: {
                bagian: {
                    id: number
                    namaBagian: string
                }
                jabatan: {
                    id: number
                    namaJabatan: string
                }
            }
        }]
        email: string
        id: number
        isActive: boolean
        isAdmin: boolean
        nama: string
        nik: string
    }
}

const enumBoolean = ["true", "false"] as const


export function EditUser({ id, session }: { id: number, session: string }) {
    const router = useRouter()

    const { detailUser: user, detailUserLoading, mutateUser }: { detailUser: DetailUserType, detailUserLoading: boolean, mutateUser: VoidFunction } = GetDetailUserInfo(id, session)
    const { detailBagian: listBagian, isLoadingBagian, mutateBagian }: { detailBagian: { count: number, data: IBagian[] }, isLoadingBagian: boolean, mutateBagian: VoidFunction } = useGetAllBagian(session, false)

    const [disabledBagianJabatanEditMode, setDisabledBagianJabatanEditMode] = useState<boolean>(true)
    const [addMode, setAddMode] = useState<boolean>(false)

    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false)
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false)

    const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false)

    const [defaultValueBagian, setDefaultValueBagian] = useState<string>("")
    const [defaultValueJabatan, setDefaultValueJabatan] = useState<string>("")

    const bagianRef = useRef<HTMLSelectElement>(null)
    const jabatanRef = useRef<HTMLSelectElement>(null)

    const [listJabatan, setListJabatan] = useState<JabatanType[] | null>(null)
    const [isLoadingJabatan, setIsLoadingJabatan] = useState<boolean>(true)

    const [issues, setIssues] = useState<ZodIssue[] | null>(null)

    const getJabatan = useCallback(async (idBagian: string) => {
        setIsLoadingJabatan(true)
        const listJabatan = await GetJabatanByIDBagian(idBagian, session)
        setListJabatan(listJabatan.data)
        setIsLoadingJabatan(false)
    }, [session])

    useEffect(() => {
        if (!isLoadingBagian && !detailUserLoading && user !== undefined) {
            const bagianData = user.data.bagianjabatan[0]
            if (bagianData) {
                setDefaultValueBagian(bagianData.bagianJabatan.bagian.id.toString())
                setDefaultValueJabatan(bagianData.idBagianJabatanKey.toString())
                getJabatan(bagianData.bagianJabatan.bagian.id.toString())
            } else {
                getJabatan(listBagian.data[0].id!.toString())
            }

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingBagian, detailUserLoading, user])

    //console.log("detail user ", !detailUserLoading && user.data)
    //console.log("data jabatan ", (defaultBagian))

    async function checkNIK(nik: string) {
        const NIKCheck = await axios(apiURL + "/admin/users/checkNIK/?nik=" + nik, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session
            }
        })

        return NIKCheck
    }

    // Zod Object validasi Form
    const User = z.object({
        nama: z.string().min(1, { message: "Nama minimal 1 karakter" }),
        nik: z.string()
            .max(5, { message: "NIK maksimal 5 karakter" })
            .min(5, { message: "NIK minimal 5 karakter" })
            .superRefine(async (nik, ctx) => {
                if (nik == user.data.nik) {
                    return z.NEVER
                }

                const NIKExist = await checkNIK(nik)


                if (NIKExist.data.message == "exist") {
                    ctx.addIssue({
                        code: "custom",
                        message: "NIK Sudah Terdaftar",
                        path: ['nik']

                    })
                }

                const regex = /^\d+$/;
                if (!regex.test(nik)) {
                    ctx.addIssue({
                        code: "custom",
                        message: "NIK harus berupa angka",
                    });
                }
                
                if (nik == "00000") {
                    ctx.addIssue({
                        code: "custom",
                        message: "NIK tidak boleh 00000",
                    });
                }
            }),
        // Email Object
        email: z.string().email().min(3).superRefine(async (email, ctx) => {
            // Jika email tidak berubah
            if (email == user.data.email) {
                return z.NEVER
            }

            // Check Email apakah ada?
            const isEmailExist = await checkEmail(email, session)

            if (isEmailExist.data.message == "exist") {
                ctx.addIssue({
                    code: "custom",
                    message: "Email Sudah Terdaftar",
                    path: ['email']

                })
            }
        }),

        // Password Object
        password: z.string().superRefine((password, ctx) => {
            // Jika password == default
            if (password === "default") {
                return z.NEVER
            } else {

                // Jika password < 8 karakter
                if (password.length < 8) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Password harus lebih dari 8 karakter",
                    })
                }

                // Jika password tidak terdapat angka
                if (!password.match(".*[0-9].*")) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Password minimal terdapat 1 angka",
                    })
                }

                // Jika password tidak terdapat simbol
                if (!password.match(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Password minimal terdapat 1 simbol",
                    })
                }

                // Jika password tidak terdapat huruf kapital
                if (!password.match(".*[A-Z].*")) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Password minimal terdapat 1 huruf kapital",
                    });
                }
            }
        }),

        // isAdmin Object
        isAdmin: z.enum(enumBoolean, { message: "Pilihan tidak ada" }),

        // isActive Object
        isActive: z.enum(enumBoolean, { message: "Pilihan tidak ada" }),

        idBagianJabatan: z.string().optional(),
        idKeyBagianJabatan: z.string().optional()
    })

    // Handle bagian Changed
    const handleBagianChanged = async (id: string) => {
        getJabatan(id)
    }

    // Handle Delete Jabatan by User
    const handleDeleteJabatanUser = async (id: string) => {
        setIsLoadingDelete(true)
        try {
            const deleteProcess = await deleteBagianJabatanUser(id, session)
            if (deleteProcess.data.message == "delete jabatan berhasil") {
                toast.success("Delete Jabatan Berhasil")
                setAddMode(false)
                setDefaultValueBagian("")
                setDefaultValueJabatan("")
                setDisabledBagianJabatanEditMode(true)
                mutateUser()
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                toast.error("Delete Jabatan Gagal \n code: " + e.code)
            } else {
                toast.error("Delete Jabatan Gagal")
            }
        }
        setDeleteModalShow(false)
        setIsLoadingDelete(false)
    }

    // Handle ketika User batal Add/Edit Bagian Jabatan
    const handleBatal = async () => {
        const defaultBagianId = user.data.bagianjabatan[0] === undefined ? "" : user.data.bagianjabatan[0].bagianJabatan.bagian.id.toString()
        const defaultJabatanId = user.data.bagianjabatan[0] === undefined ? "" : user.data.bagianjabatan[0].idBagianJabatanKey.toString()
        setDefaultValueBagian(defaultBagianId)
        setDefaultValueJabatan(defaultJabatanId)
        setAddMode(false)
        if (user.data.bagianjabatan[0] !== undefined) {
            handleBagianChanged(defaultBagianId)
        }
        setDisabledBagianJabatanEditMode(true)
    }

    // Handle onClose Delete Modal
    const handleCloseDeleteModal = () => {
        setDeleteModalShow(false)
    }

    // Handle Ketika Simpan Perubahan Invoked --> Save User Information
    const handleSaveChanges = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoadingAdd(true)
        const formData = new FormData(e.currentTarget)
        // Cek apabila bagian & jabatan disabled

        const nik = formData.get("nik")
        const nama = formData.get("nama")
        const password = formData.get("newPassword")
        const email = formData.get("email")
        const isAdmin = formData.get("isAdmin") == "1" ? "true" : "false"
        const isActive = formData.get("isActive") == "1" ? "true" : "false"

        //console.log("bagian ", newIdBagianJabatan)

        User.parseAsync({
            nik: nik,
            nama: nama,
            email: email,
            password: password,
            isActive: isActive,
            isAdmin: isAdmin,
        }).then(async (data) => {
            setIssues(null)
            //console.log("data post, ", data)

            // Proses Update User
            const processUpdateUser = await updateDataUser({ data: { ...data, id: user.data.id.toString() }, session })

            // Jika update berhasil
            if (processUpdateUser.data.message == "update user berhasil") {
                toast.success("Update Data User Berhasil")
                mutateUser()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }
            if (e instanceof AxiosError) {
                toast.error("Bagian Gagal Ditambahkan")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })
    }


    // Handle untuk menyimpan Bagian Jabatan
    const handleSaveBagianJabatan = async (idBagianJabatan: string, newIdBagianJabatan: string, userId: string) => {
        setIsLoadingAdd(true)
        if (newIdBagianJabatan == "") {
            setIsLoadingAdd(false)
            return toast.error("Jabatan Kosong")
        }

        //console.log("data ", { idBagianJabatan, newIdBagianJabatan, userId })

        if (idBagianJabatan !== "") {
            try {
                const addProcess = await updateDataUserBagianJabatan({ id: idBagianJabatan, idBagianJabatan: newIdBagianJabatan }, session)
                //console.log("status text", addProcess)
                if (addProcess.data.status == "success") {
                    toast.success("Update Bagian Jabatan Berhasil")
                    setAddMode(false)
                    setDisabledBagianJabatanEditMode(true)
                    mutateUser()
                }
            } catch (e) {
                e instanceof AxiosError && toast.error("Tambah Bagian Jabatan Gagal")
            }finally{
                setIsLoadingAdd(false)
            }
        } else {
            try {
                const addProcess = await addBagianJabatan({ idBagianJabatan: newIdBagianJabatan, idUser: userId }, session)
                console.log("status text: ", addProcess)
                if (addProcess.status == 200) {
                    toast.success("Tambah Bagian Jabatan Berhasil")
                    setAddMode(false)
                    setDisabledBagianJabatanEditMode(true)
                    mutateUser()
                }
            } catch (e) {
                e instanceof AxiosError && toast.error("Tambah Bagian Jabatan Gagal")
            }finally{
                setIsLoadingAdd(false)
            }
        }

        setIsLoadingAdd(false)


    }

    return (
        <div>
            <div className='row mb-1'>
                <div className='col-1'>
                    <button className="btn btn-sm btn-warning text-white" onClick={(e) => {
                        e.preventDefault()
                        router.back()
                        toast.remove()
                    }}><FontAwesomeIcon icon={faCaretLeft} /> &nbsp; Back</button>
                </div>
            </div>

            {/* Card Section */}
            <div className='card'>
                <div className='card-header'>
                    Edit User <b>{(!detailUserLoading && user !== undefined) && `${user.data.nik} - ${user.data.nama}`}</b>
                </div>
                <div className='card-body p-3'>
                    <div className="d-flex justify-content-center align-items-start">
                        <div className="w-100  row align-items-start">
                            {/* Profile Photo */}
                            <div className="col-3 d-flex justify-content-center">
                                <Image src="/users-profile/default-profile.jpg" width={80} height={120} alt="profilephoto"></Image>
                            </div>

                            {/* Form Edit */}
                            <div className="col-9">
                                <div className="ps-3 pt-4">
                                    {detailUserLoading && <>Loading...</>}
                                    {(!detailUserLoading && user !== undefined) ?
                                        <form onSubmit={handleSaveChanges}>
                                            {/* NIK User */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">NIK</label>
                                                <div className="col-sm-8">
                                                    <input type="text" name="nik" maxLength={5} className="form-control" defaultValue={user.data.nik} />
                                                    <ul>
                                                        {issues && issues.map((item: any, index: number) => (
                                                            item.path[0] == "nik" &&
                                                            <li key={index}>
                                                                <span className="form-text text-danger">{item.message}</span><br />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Nama User */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Nama</label>
                                                <div className="col-sm-8">
                                                    <input type="text" name="nama" className="form-control" defaultValue={user.data.nama} />
                                                    <ul>
                                                        {issues && issues.map((item: any, index: number) => (
                                                            item.path[0] == "nama" &&
                                                            <li key={index}>
                                                                <span className="form-text text-danger">{item.message}</span><br />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Email User */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Email</label>
                                                <div className="col-sm-8">
                                                    <input type="email" className="form-control" name="email" defaultValue={user.data.email} />
                                                    <ul>
                                                        {issues && issues.map((item: any, index: number) => (
                                                            item.path[0] == "email" &&
                                                            <li key={index}>
                                                                <span className="form-text text-danger">{item.message}</span><br />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Password User */}
                                            <div className="mb-3 row">
                                                <label htmlFor="inputPassword" className="col-sm-4 col-form-label">Password</label>
                                                <div className="col-sm-8">
                                                    <input type="password" className="form-control" name="newPassword" id="inputPassword" defaultValue="default" />
                                                    <ul>
                                                        {issues && issues.map((item: any, index: number) => (
                                                            item.path[0] == "password" &&
                                                            <li key={index}>
                                                                <span className="form-text text-danger">{item.message}</span><br />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* is Admin User */}
                                            <div className="mb-3 row">
                                                <div className="col-sm-4 col-form-label">Status Admininstator</div>
                                                <div className="col-sm-8">
                                                    <select defaultValue={user.data.isAdmin === true ? "1" : "0"} name="isAdmin" className="form-select">
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* is Active User */}
                                            <div className="mb-3 row">
                                                <div className="col-sm-4 col-form-label">Status Active</div>
                                                <div className="col-sm-8">
                                                    <select defaultValue={user.data.isActive === true ? "1" : "0"} name="isActive" className="form-select">
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                    </select>
                                                </div>
                                            </div>


                                            {defaultValueBagian === "" && addMode == false &&
                                                <>
                                                    <div className="mb-3 row">
                                                        <div className="col-sm-4"></div>
                                                        <div className="col-sm-8">
                                                            <button onClick={(e) => {
                                                                e.preventDefault()
                                                                setAddMode(true)
                                                                setDisabledBagianJabatanEditMode(false)
                                                            }} className='btn btn-sm btn-success'><FontAwesomeIcon icon={faPlus} /> Tambah Bagian Jabatan</button>
                                                        </div>
                                                    </div>
                                                </>}

                                            {(addMode == true || defaultValueBagian !== "") &&
                                                <>
                                                    {/* // Bagian */}
                                                    <div className="mb-3 row">
                                                        <div className="col-sm-4 col-form-label">Bagian</div>
                                                        <div className="col-sm-8">
                                                            <select value={defaultValueBagian} onChange={(e) => {
                                                                const bagianId = e.target.value
                                                                setDefaultValueBagian(bagianId)
                                                                handleBagianChanged(bagianId)
                                                                //console.log("id ", bagianId)
                                                            }} ref={bagianRef} name="bagian" className="form-select" disabled={disabledBagianJabatanEditMode}>
                                                                {isLoadingBagian && <option>Loading....</option>}
                                                                {!isLoadingBagian && listBagian !== null && listBagian.data.map((bagian: IBagian, index: number) => (
                                                                    <option key={bagian.id} value={bagian.id}>{bagian.namaBagian}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* // Jabatan */}
                                                    <div className="mb-3 row">
                                                        <div className="col-sm-4 col-form-label">Jabatan</div>
                                                        <div className="col-sm-8">
                                                            {listJabatan !== null &&
                                                                <select ref={jabatanRef} value={defaultValueJabatan} onChange={(e) => {
                                                                    const jabatanId = e.target.value
                                                                    setDefaultValueJabatan(jabatanId)
                                                                }} name="jabatan" className="form-select" disabled={disabledBagianJabatanEditMode}>
                                                                    {!isLoadingJabatan && listJabatan !== null && listJabatan.length == 0 ?
                                                                        // Jika Jabatan Kosong
                                                                        <option value="">-- Jabatan Kosong --</option> :
                                                                        // Jika Jabatan Tidak Kosong
                                                                        listJabatan.map((jabatan: JabatanType, index: number) => (
                                                                            <option key={jabatan.id} value={jabatan.id}>{jabatan.idJabatanFK.namaJabatan}</option>
                                                                        ))
                                                                    }
                                                                </select>}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 row">
                                                        <div className="col-sm-4"></div>
                                                        <div className="col-sm-8">
                                                            {(disabledBagianJabatanEditMode && user.data.bagianjabatan[0] !== undefined) ?
                                                                // Tombol Edit jika disable edit mode true
                                                                <>
                                                                    {/* Aktif Edit Mode */}
                                                                    <button onClick={(e) => {
                                                                        e.preventDefault()
                                                                        setDisabledBagianJabatanEditMode(false)
                                                                    }} className='btn btn-sm btn-warning text-white me-2' disabled={isLoadingAdd}><FontAwesomeIcon icon={faPenToSquare} /> Edit Bagian Jabatan</button>

                                                                    {/* Hapus Button */}
                                                                    <button onClick={(e) => {
                                                                        e.preventDefault()
                                                                        setDeleteModalShow(true)
                                                                    }} className='btn btn-sm btn-danger text-white'><FontAwesomeIcon icon={faTrashCan} /> Hapus Bagian Jabatan</button>

                                                                    {/* Modal Delete Confirmation */}
                                                                    <Modal show={deleteModalShow} onHide={handleCloseDeleteModal}>
                                                                        <Modal.Header closeButton>
                                                                            <Modal.Title>Delete Confirmation</Modal.Title>
                                                                        </Modal.Header>
                                                                        <Modal.Body>Apakah anda yakin akan menghapus jabatan {user.data.bagianjabatan[0].bagianJabatan.jabatan.namaJabatan}?</Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="secondary" onClick={handleCloseDeleteModal}>
                                                                                Batal
                                                                            </Button>
                                                                            <Button variant="danger" onClick={() => {
                                                                                handleDeleteJabatanUser(user.data.bagianjabatan[0].idBagianJabatan.toString())
                                                                            }} disabled={isLoadingDelete}>
                                                                                Hapus Jabatan
                                                                            </Button>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                </> :
                                                                <>

                                                                    {/* // Tombol Batal Edit */}
                                                                    <button onClick={(e) => {
                                                                        e.preventDefault()
                                                                        handleBatal()
                                                                    }} className='btn btn-sm btn-danger text-white me-2' disabled={isLoadingAdd}><FontAwesomeIcon icon={faBan} /> Batal</button>

                                                                    {/* // Tombol Save Bagian Jabatan */}
                                                                    <button onClick={(e) => {
                                                                        e.preventDefault()
                                                                        //handleBatal()
                                                                        const currentIdBagianJabatanKey = user.data.bagianjabatan[0] == undefined ? "" : user.data.bagianjabatan[0].idBagianJabatan.toString()
                                                                        const userId = user.data.id.toString()
                                                                        const newIdBagianJabatan = jabatanRef.current!.value
                                                                        setDefaultValueJabatan(newIdBagianJabatan)
                                                                        handleSaveBagianJabatan(currentIdBagianJabatanKey, newIdBagianJabatan, userId)
                                                                    }} className='btn btn-sm btn-success text-white' disabled={isLoadingAdd}><FontAwesomeIcon icon={faFloppyDisk} /> Simpan Bagian Jabatan</button>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </>}

                                            <div className="mb-3 row">
                                                <div className="col-sm-12 d-flex justify-content-end col-form-label">
                                                    <button className='btn btn-sm btn-success' type="submit" disabled={isLoadingAdd}>
                                                        <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Simpan Perubahan
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        : !detailUserLoading && <>Failed To Fetch Data</>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div >
    )
}
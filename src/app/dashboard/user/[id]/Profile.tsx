"use client"
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "react-hot-toast"
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { apiURL } from "@/app/lib/admin/users/userAPIRequest"

export default function Profile({ userInfo, session }: { userInfo: any, session: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState(false)
    const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false)

    async function handleSaveChanges(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (password.length < 8 && confirmPassword.length < 8) {
            toast.error('Password Minimal 8 Karakter')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Password Tidak Sama')
            return
        }

        if (!password.match(".*[0-9].*") && !confirmPassword.match(".*[0-9].*")) {
            toast.error('Password minimal terdapat 1 angka')
            return
        }

        // Jika password tidak terdapat simbol
        if (!password.match(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*") && !confirmPassword.match(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            toast.error('Password minimal terdapat 1 simbol')
            return
        }

        // Jika password tidak terdapat huruf kapital
        if (!password.match(".*[A-Z].*") && !confirmPassword.match(".*[A-Z].*")) {
            toast.error('Password minimal terdapat 1 huruf kapital')
            return
        }

        if (password == confirmPassword) {
            try {
                const request = await axios.patch(`${apiURL}/admin/users/updatePassword/${userInfo.id}`, {
                    password: password,
                    confirm_password: confirmPassword
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session}`

                    }
                })

                if (request.status === 200) {
                    toast.success('Berhasil Mengubah Password')
                    setPassword('')
                    setConfirmPassword('')
                }


            } catch (e) {
                toast.error('Gagal Mengubah Password')
            }
        }
    }

    useEffect(() => {
        console.log(userInfo)
        //eslint-disable-next-line
    }, [])

    return (
        <>
            {userInfo === undefined && <h2>Gagal Menambil Info User</h2>}
            {userInfo &&
                <div>
                    <div className='row mb-1'>
                        <div className='col-1'>
                            <button className="btn btn-sm btn-warning text-white" onClick={(e) => {
                                e.preventDefault()
                                router.back()
                                toast.remove()
                            }}>
                                <FontAwesomeIcon icon={faCaretLeft} /> &nbsp; Back
                            </button>
                        </div>
                    </div>

                    {/* Card Section */}
                    <div className='card'>
                        <div className='card-header'>
                            Profile Info <b>{`${userInfo.name}`}</b>
                        </div>
                        <div className='card-body p-3'>
                            <div className="d-flex justify-content-center align-items-start">
                                <div className="w-100 row align-items-start">
                                    {/* Form Edit */}
                                    <div className="col-12">
                                        <form onSubmit={handleSaveChanges}>

                                            {/* Nama User */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Nama</label>
                                                <div className="col-sm-8">
                                                    <input type="text" name="nama" className="form-control" defaultValue={userInfo.name} readOnly />
                                                </div>
                                            </div>

                                            {/* Email User */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Email</label>
                                                <div className="col-sm-8">
                                                    <input type="email" className="form-control" name="email" defaultValue={userInfo.email} readOnly />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Password</label>
                                                <div className="col-sm-8">
                                                    <input type={checkPassword ? "text" : "password"} className="form-control" name="password" onChange={(e) => {
                                                        setPassword(e.target.value)
                                                        if (e.target.value.length > 0) setIsLoadingChangePassword(true)
                                                        else setIsLoadingChangePassword(false)
                                                    }} />
                                                    <div className="form-text">Password harus minimal 8 karakter, berisi 1 nomor, 1 simbol, dan 1 angka! </div>
                                                    {isLoadingChangePassword && <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" defaultChecked={checkPassword} onChange={(e) => {
                                                            setCheckPassword(e.target.checked)
                                                        }} />
                                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                                            Lihat Password
                                                        </label>
                                                    </div>}
                                                </div>
                                            </div>

                                            {isLoadingChangePassword &&
                                                <div className="mb-3 row">
                                                    <label className="col-sm-4 col-form-label">Konfirmasi Password</label>
                                                    <div className="col-sm-8">
                                                        <input type="password" className="form-control" name="confirmPassword" onChange={(e) => {
                                                            setConfirmPassword(e.target.value)
                                                        }} />
                                                    </div>
                                                </div>}

                                            {/* Status Admin */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Status Admin</label>
                                                <div className="col-sm-8">
                                                    <select defaultValue={userInfo.is_admin ? "1" : "0"} name="is_admin" className="form-select" disabled>
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Bagian */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Bagian</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" name="bagian" defaultValue={userInfo.bagian_jabatan[0]?.nama_bagian} readOnly />
                                                </div>
                                            </div>

                                            {/* Jabatan */}
                                            <div className="mb-3 row">
                                                <label className="col-sm-4 col-form-label">Jabatan</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" name="jabatan" defaultValue={userInfo.bagian_jabatan[0]?.nama_jabatan} readOnly />
                                                </div>
                                            </div>

                                            {/* Tombol Simpan */}
                                            <div className="mb-3 row">
                                                <div className="col-sm-12 d-flex justify-content-end col-form-label">
                                                    <button className='btn btn-sm btn-success' type="submit" disabled={isLoading}>
                                                        <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Simpan Perubahan
                                                    </button>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toaster />
                </div>}
        </>
    )
}
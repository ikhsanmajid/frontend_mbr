import { apiURL, checkEmail } from "@/app/lib/admin/users/userAPIRequest"
import { ToastContainer, toast } from 'react-toastify'
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import axios from "axios"
import React from "react"
import axiosInstance from "@/app/lib/admin/users/axios"

export default function ModalAdd({ show, session, onClose, mutate }: { show: boolean, session: string, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[]>([])
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    async function checkNIK(nik: string) {
        const NIKCheck = await axios(apiURL + "/admin/users/checkNIK/?nik=" + nik, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session
            }
        })

        return NIKCheck
    }


    const User = z.object({
        fullName: z.string().min(1, { message: "Nama minimal 1 karakter" }),
        nik: z.string()
            .min(5, { message: "NIK minimal 5 karakter" })
            .max(5, { message: "NIK maksimal 5 karakter" })
            .superRefine((nik, ctx) => {
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
        email: z.string().email(),
        password: z.string().min(8, { message: "Password harus lebih dari 8 karakter" }),
        repeatedPassword: z.string()
    }).superRefine(async ({ password, repeatedPassword, email, nik }, ctx) => {
        const emailExist = await checkEmail(email, session)
        const NIKExist = await checkNIK(nik)

        if (emailExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Email Sudah Terdaftar",
                path: ['email']

            })
        }

        if (NIKExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "NIK Sudah Terdaftar",
                path: ['nik']

            })
        }

        if (password !== repeatedPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Password tidak sama",
                path: ['repeatedPassword']

            })
        }
    })

    async function add_user(data: any) {
        const addProcess = axiosInstance.post(apiURL + "/admin/users/addUser", {
            email: data.email,
            nik: data.nik,
            nama: data.fullName,
            password: data.repeatedPassword
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session
            }
        })

        return (await addProcess).data
    }

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const dataFullName = data.get("fullName")
        const dataNIK = data.get("nik")
        const dataEmail = data.get("email")
        const dataPassword = data.get("password")
        const dataRepeatPassword = data.get("repeatPassword")

        await User.parseAsync({
            fullName: dataFullName,
            nik: dataNIK,
            email: dataEmail,
            password: dataPassword,
            repeatedPassword: dataRepeatPassword
        }).then(async (data) => {
            setIssues([])
            const postAddUser = await add_user(data)
            //console.log("post, ", postAddUser)
            if (postAddUser.type !== "error") {
                toast.success("User Berhasil Ditambahkan")
                mutate!()
                onClose()
            }
        }).catch(e => {
            console.log("add user catch ", e)
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }
            if (!(e instanceof z.ZodError)) {
                toast.error("User Gagal Ditambahkan")
            }
            if (e instanceof axios.AxiosError) {
                if (e.response?.status === 401) {
                    window.location.href = '/login?expired=true';
                }
            }
            //console.log("add user catch ", e)
        }).finally(() => {
            setTimeout(() => setIsLoadingAdd(false), 3000)
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>
                        {/* NIK */}
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">NIK</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" maxLength={5} inputMode="numeric" name="nik" placeholder="Ketik NIK" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "nik" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Nama Lengkap</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="fullName" placeholder="Nama Lengkap" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "fullName" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Email</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="email" placeholder="example@domain.com" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "email" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Password</label>
                            <div className="col-sm-8">
                                <input type="password" className="form-control" name="password" placeholder="Ketik Password" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "password" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Confirmation Password */}
                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Ulangi Password</label>
                            <div className="col-sm-8">
                                <input type="password" className="form-control" name="repeatPassword" placeholder="Ketik Password" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "repeatedPassword" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="btn-sm" onClick={onClose}>
                        Batal
                    </Button>

                    <button type="submit" disabled={isLoadingAdd} className="btn btn-sm btn-success" form="addForm" name="submit">{isLoadingAdd ? "Loading" : "Save"}</button>

                </Modal.Footer>

            </Modal>

        </>
    )
}
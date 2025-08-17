import { apiURL } from "@/app/lib/admin/users/userAPIRequest"
import { Modal, Button } from "react-bootstrap"
import { useSession } from "next-auth/react"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import axios, { AxiosError } from "axios"
import { ToastContainer, toast } from 'react-toastify'
import axiosInstance from "@/app/lib/axios"

export default function ModalAdd({ show, session, onClose, mutate }: { show: boolean, session: string, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    async function checkJabatan(jabatan: string) {
        const jabatanCheck = await axios(apiURL + "/admin/employment/findFixedEmployment/?nama_jabatan=" + jabatan, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session
            }
        })

        return jabatanCheck
    }

    const Jabatan = z.object({
        jabatan: z.string().min(1, { message: "Nama Jabatan minimal 1 karakter" }),
    }).superRefine(async ({ jabatan }, ctx) => {
        const jabatanExist = await checkJabatan(jabatan)

        if (jabatanExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Jabatan Sudah Terdaftar",
                path: ['jabatan']

            })
        }
    })

    async function add_jabatan(data: any) {
        const addProcess = axiosInstance.post(apiURL + "/admin/employment/addEmployment", {
            nama_jabatan: data.jabatan
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
        const dataJabatan = data.get("jabatan")

        await Jabatan.parseAsync({
            jabatan: dataJabatan,
        }).then(async (e) => {
            setIssues([])
            const postAddJabatan = await add_jabatan(e)
            if (postAddJabatan.type !== "error") {
                toast.success("Jabatan Berhasil Ditambahkan")
                mutate!()
                onClose()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    window.location.href = '/login?expired=true'; // Redirect menggunakan App Router
                }
                toast.error("Jabatan Gagal Ditambahkan")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={() => { onClose(); setIssues(null) }} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Tambah Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>

                        {/* Jabatan */}
                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Nama Jabatan</label>
                            <div className="col-sm-8">
                                <input type="text" autoComplete="off" className="form-control" name="jabatan" placeholder="Nama Jabatan" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "jabatan" &&
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
                    <Button variant="danger" className="btn-sm" onClick={() => { onClose(); setIssues(null) }}>
                        Batal
                    </Button>

                    <button type="submit" disabled={isLoadingAdd} className="btn btn-sm btn-success" form="addForm" name="submit">{isLoadingAdd ? "Loading" : "Save"}</button>

                </Modal.Footer>

            </Modal>
            <ToastContainer/>
        </>
    )
}
import { add_bagian, apiURL, checkBagian } from "@/app/lib/admin/users/userAPIRequest"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import { AxiosError } from "axios"
import toast, { Toaster } from "react-hot-toast"
import React from "react"

export default function ModalAdd({ show, session, onClose, mutate }: { show: boolean, session: string, onClose: () => void, mutate: null | VoidFunction}) {
    const [issues, setIssues] = useState<ZodIssue[]>([])
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    const Bagian = z.object({
        bagian: z.string().min(1, { message: "Nama Bagian minimal 1 karakter" }),
    }).superRefine(async ({ bagian }, ctx) => {
        const bagianExist = await checkBagian(bagian, session)

        if (bagianExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Bagian Sudah Terdaftar",
                path: ['bagian']

            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const dataBagian = data.get("bagian")

        await Bagian.parseAsync({
            bagian: dataBagian,
        }).then(async (data) => {
            setIssues([])
            const postAddUser = await add_bagian(data, session)
            if (postAddUser.type !== "error") {
                toast.success("Bagian Berhasil Ditambahkan")
                mutate!()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }
            
            if (e instanceof AxiosError){
                toast.error("Bagian Gagal Ditambahkan")
            }
        }).finally(() => {
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

                        {/* Bagian */}
                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Nama Bagian</label>
                            <div className="col-sm-8">
                                <input type="text" autoComplete="off" className="form-control" name="bagian" placeholder="Nama Bagian" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "bagian" &&
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
            <Toaster/>
        </>
    )
}
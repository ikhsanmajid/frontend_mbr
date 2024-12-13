import { checkBagian, edit_bagian } from "@/app/lib/admin/users/userAPIRequest"
import { IBagian } from "./ListBagian"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import { AxiosError } from "axios"
import toast, { Toaster } from "react-hot-toast"
import React from "react"

export default function ModalEdit({ show, session, onClose, editData, bagianMutate }: { show: boolean, session: string, onClose: () => void, editData: IBagian | null, bagianMutate: () => void }) {
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    // Zod Inisiasi
    const activeEnum = ["0", "1"] as const;
    const Bagian = z.object({
        bagian: z.string().min(1, { message: "Nama Bagian minimal 1 karakter" }),
        active: z.enum(activeEnum, { message: "Not Allowed" })
    }).superRefine(async ({ bagian }, ctx) => {
        if (bagian == editData?.namaBagian) {
            return
        }

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
        const dataActive = data.get("is_active")

        await Bagian.parseAsync({
            bagian: dataBagian,
            active: dataActive
        }).then(async (e) => {
            setIssues(null)
            const postEditBagian = await edit_bagian(editData?.id, e, session)
            if (postEditBagian.type !== "error") {
                toast.success("Bagian Berhasil Diupdate", {
                    duration: 2000
                })
                bagianMutate()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                toast.error("Bagian Gagal Diupdate")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>
                        {/* Bagian */}
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Nama Bagian</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="bagian" defaultValue={editData ? editData.namaBagian : ""} placeholder="Nama Bagian" />
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

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Aktif</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="is_active" defaultValue={editData && editData.isActive == true ? "1" : "0"}>
                                    <option value="0">Non-aktif</option>
                                    <option value="1">Aktif</option>
                                </select>
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "active" &&
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
                    <Button variant="danger" className="btn-sm" onClick={() => {
                        onClose()
                        setIssues(null)
                    }}>
                        Batal
                    </Button>

                    <button type="submit" disabled={isLoadingAdd} className="btn btn-sm btn-success" form="addForm" name="submit">{isLoadingAdd ? "Loading" : "Save"}</button>

                </Modal.Footer>

            </Modal>
            <Toaster />
        </>
    )
}
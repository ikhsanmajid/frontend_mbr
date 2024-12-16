import { checkJabatan, edit_jabatan } from "@/app/lib/admin/users/userAPIRequest"
import { Jabatan } from "./JabatanTable"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import { AxiosError } from "axios"
import toast, { Toaster } from "react-hot-toast"

export default function ModalEdit({ show, session, onClose, editData, mutate }: { show: boolean, session: string, onClose: () => void, editData: Jabatan | null, mutate: () => void }) {
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    // Zod Inisiasi
    const activeEnum = ["0", "1"] as const;
    const Jabatan = z.object({
        jabatan: z.string().min(1, { message: "Nama Jabatan minimal 1 karakter" }),
        active: z.enum(activeEnum, { message: "Not Allowed" })
    }).superRefine(async ({ jabatan }, ctx) => {
        if (jabatan == editData?.namaJabatan) {
            return
        }

        const jabatanExist = await checkJabatan(jabatan, session)

        if (jabatanExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Jabatan Sudah Terdaftar",
                path: ['jabatan']

            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()

        setIsLoadingAdd(true)

        const data = new FormData(formData.currentTarget)
        const dataJabatan = data.get("jabatan")
        const dataActive = data.get("is_active")

        await Jabatan.parseAsync({
            jabatan: dataJabatan,
            active: dataActive
        }).then(async (e) => {
            setIssues(null)
            const postEditJabatan = await edit_jabatan(editData?.id, e, session)
            if (postEditJabatan.type !== "error") {
                toast.success("Jabatan Berhasil Diupdate", {
                    duration: 2000
                })
                mutate()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                toast.error("Jabatan Gagal Diupdate")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Edit Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>
                        {/* Jabatan */}
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Nama Jabatan</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="jabatan" defaultValue={editData ? editData.namaJabatan : ""} placeholder="Nama Jabatan" />
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
import { add_kategori, apiURL, checkCategory } from "@/app/lib/admin/users/userAPIRequest"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import { AxiosError } from "axios"
import { toast } from 'react-toastify'
import React from "react"

export default function ModalAdd({ show, session, onClose, mutate }: { show: boolean, session: string, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[]>([])
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    const Category = z.object({
        namaKategori: z.string().min(1, { message: "Nama Kategori minimal 1 karakter" }),
        startingNumber: z.string().min(6, { message: "Nomor Urut minimal 6 karakter" }).max(6, { message: "Nomor Urut maksimal 6 karakter" }),
    }).superRefine(async ({ namaKategori, startingNumber }, ctx) => {
        if (!startingNumber.match(/^[0-9]+$/)) {
            ctx.addIssue({
                code: "custom",
                message: "Starting Number Harus Angka",
                path: ['startingNumber']
            })
        }

        const categoryExist = await checkCategory(namaKategori, session)

        if (categoryExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Kategori Sudah Terdaftar",
                path: ['namaKategori']

            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const dataKategori = data.get("namaKategori")
        const dataStartingNumber = data.get("startingNumber")

        await Category.parseAsync({
            namaKategori: dataKategori,
            startingNumber: dataStartingNumber
        }).then(async (data) => {
            setIssues([])
            const postAddCategory = await add_kategori(data, session)
            if (postAddCategory.type !== "error") {
                toast.success("Kategori Berhasil Ditambahkan")
                mutate!()
                onClose()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                toast.error("Kategori Gagal Ditambahkan")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Tambah Kategori</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>

                        {/* Bagian */}
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Nama Kategori</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="namaKategori" placeholder="Nama Kategori" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "namaKategori" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Nomor Urut Awal: </label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="startingNumber" maxLength={6} minLength={6} placeholder="Nomor Urut Awal" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "startingNumber" &&
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
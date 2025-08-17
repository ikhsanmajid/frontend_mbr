import { add_bagian, checkBagian } from "@/app/lib/admin/users/userAPIRequest"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import { AxiosError } from "axios"
import { toast } from 'react-toastify'
import React from "react"

export default function ModalAdd({ show, onClose, mutate }: { show: boolean, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[]>([])
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    const Bagian = z.object({
        bagian: z.string().min(1, { message: "Nama Bagian minimal 1 karakter" }),
        kategori: z.string()
    }).superRefine(async ({ bagian, kategori }, ctx) => {
        const bagianExist = await checkBagian(bagian)

        if (bagianExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Bagian Sudah Terdaftar",
                path: ['bagian']

            })
        }

        if (kategori == "") {
            ctx.addIssue({
                code: "custom",
                message: "Wajib Memilih Kategori",
                path: ['kategori']
            })
        } 
        
        if (kategori !== "1" && kategori !== "2" && kategori !== "3") {
            ctx.addIssue({
                code: "custom",
                message: "Kategori Tidak Valid",
                path: ['kategori']
            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const dataBagian = data.get("bagian")
        const dataKategori = data.get("kategori")

        await Bagian.parseAsync({
            bagian: dataBagian,
            kategori: dataKategori
        }).then(async (data) => {
            setIssues([])
            const postAddUser = await add_bagian(data)
            if (postAddUser.type !== "error") {
                toast.success("Bagian Berhasil Ditambahkan")
                mutate!()
            }
            onClose()
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

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Tambah Bagian</Modal.Title>
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

                        <div className="mb-3 row">
                            <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Kategori Bagian: </label>
                            <div className="col-sm-8">
                                <select className="form-select" name="kategori">
                                    <option value="">-- Pilih Kategori Bagian --</option>
                                    <option value="1">Farmasi</option>
                                    <option value="2">Food</option>
                                    <option value="3">Lain-Lain</option>
                                </select>
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "kategori" &&
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
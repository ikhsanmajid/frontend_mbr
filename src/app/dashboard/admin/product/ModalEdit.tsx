import { apiURL } from "@/app/lib/admin/users/userAPIRequest"
import { AxiosError } from "axios"
import { edit_produk, useGetAllBagian, FetchAllKategori } from "@/app/lib/admin/users/userAPIRequest"
import { IProduct } from "./ListProduct"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import axiosInstance from "@/app/lib/admin/users/axios"

export default function ModalEdit({ show, session, onClose, editData, mutate }: { show: boolean, session: string, onClose: () => void, editData: IProduct | null, mutate: () => void }) {
    const { detailBagian, isLoadingBagian, error: errorBagian, mutateBagian } = useGetAllBagian(session, true)
    const { detailKategori, isLoadingKategori, error: errorKategori, mutateListKategori } = FetchAllKategori(session)
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)

    async function checkProduct(value: { namaProduk: string, id_bagian: string }) {
        const { namaProduk, id_bagian } = value

        const encodedNamaProduk = encodeURIComponent(namaProduk)

        const productCheck = await axiosInstance.get(`${apiURL}/admin/product/checkProduct?nama_produk=${encodedNamaProduk}&id_bagian=${id_bagian}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session
            }
        })

        return productCheck
    }

    // Zod Inisiasi
    const activeEnum = ["0", "1"] as const;
    const Produk = z.object({
        nama_produk: z.string().min(1, { message: "Nama Produk minimal 1 karakter" }),
        id_bagian: z.string().min(1, { message: "Wajib Memilih Bagian" }),
        id_kategori: z.string().min(1, { message: "Wajib Memilih Kategori" }),
        active: z.enum(activeEnum, { message: "Not Allowed" })
    }).superRefine(async ({ nama_produk, id_bagian }, ctx) => {
        if (nama_produk == editData?.namaProduk && id_bagian == editData?.idBagian.toString()) {
            return
        }

        const productExist = await checkProduct({ namaProduk: nama_produk, id_bagian: id_bagian })

        if (productExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Produk Sudah Terdaftar",
                path: ['nama_produk']

            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()

        setIsLoadingAdd(true)

        const data = new FormData(formData.currentTarget)
        const dataProduk = data.get("nama_produk")
        const dataBagian = data.get("id_bagian")
        const dataKategori = data.get("id_kategori")
        const dataActive = data.get("is_active")

        await Produk.parseAsync({
            nama_produk: dataProduk,
            id_bagian: dataBagian,
            id_kategori: dataKategori,
            active: dataActive
        }).then(async (data) => {
            setIssues(null)
            const postEditProduct = await edit_produk(editData?.id, data, session)
            if (postEditProduct.type !== "error") {
                toast.success("Produk Berhasil Diupdate", {
                    duration: 2000
                })
                mutate()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    window.location.href = '/login?expired=true'; 
                }
                toast.error("Produk Gagal Diupdate")
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

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Nama Produk</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="nama_produk" defaultValue={editData ? editData.namaProduk : ""} placeholder="Nama Produk" />
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "nama_produk" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Bagian</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="id_bagian" defaultValue={editData ? editData.idBagian : ""}>
                                    <option value="">-- Pilih Bagian --</option>
                                    {detailBagian && detailBagian.data.map((item: any, index: number) => (
                                        <option key={index} value={item.id}>{item.namaBagian}</option>
                                    ))}
                                </select>
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "id_bagian" &&
                                        <li key={index}>
                                            <span className="form-text text-danger">{item.message}</span><br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Kategori</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="id_kategori" defaultValue={editData ? editData.idKategori : ""}>
                                    <option value="">-- Pilih Kategori --</option>
                                    {detailKategori && detailKategori.data.map((item: any, index: number) => (
                                        <option key={index} value={item.id}>{item.namaKategori}</option>
                                    ))}
                                </select>
                                <ul>
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "id_kategori" &&
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
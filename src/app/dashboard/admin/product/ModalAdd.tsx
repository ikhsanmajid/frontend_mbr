import { AxiosError } from "axios"
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify'
import { useGetAllBagian, FetchAllKategori } from "@/app/lib/admin/users/userAPIRequest"
import { useState, FormEvent, useEffect } from "react"
import { z, ZodIssue } from "zod"
import api from "@/app/lib/axios"

export default function ModalAdd({ show, onClose, mutate }: { show: boolean, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)
    const [listBagian, setListBagian] = useState<any>([])
    const [listKategori, setListKategori] = useState<any>([])

    const { detailBagian, isLoadingBagian, error: errorBagian, mutateBagian } = useGetAllBagian(true, undefined, undefined, undefined)
    const { detailKategori, isLoadingKategori, error: errorKategori, mutateListKategori } = FetchAllKategori()

    useEffect(() => {
        if (!isLoadingBagian && detailBagian) {
            setListBagian(detailBagian.data)
        }
    }, [detailBagian, isLoadingBagian])

    useEffect(() => {
        if (!isLoadingKategori && detailKategori) {
            setListKategori(detailKategori.data)
        }
    }, [detailKategori, isLoadingKategori])

    async function checkProduct(value: { namaProduk: string, id_bagian: string }) {
        const { namaProduk, id_bagian } = value
        const encodedNamaProduk = encodeURIComponent(namaProduk)
        const productCheck = await api.get(`/admin/product/checkProduct?nama_produk=${encodedNamaProduk}&id_bagian=${id_bagian}`)

        return productCheck
    }

    const Product = z.object({
        nama_produk: z.string().min(1, { message: "Nama Produk minimal 1 karakter" }),
        id_bagian: z.string().min(1, { message: "Wajib Memilih Bagian" }),
        id_kategori: z.string().min(1, { message: "Wajib Memilih Kategori" }),
    }).superRefine(async ({ nama_produk, id_bagian }, ctx) => {
        const productExist = await checkProduct({ namaProduk: nama_produk, id_bagian: id_bagian })

        if (productExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Produk Sudah Terdaftar",
                path: ['nama_produk']

            })
        }
    })

    async function add_product(data: any) {
        const addProcess = await api.post("/admin/product/addProduct")

        return addProcess.data
    }

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const dataNamaProduk = data.get("nama_produk")
        const dataIdBagian = data.get("id_bagian")
        const dataIdKategori = data.get("id_kategori")

        await Product.parseAsync({
            nama_produk: dataNamaProduk as string,
            id_bagian: dataIdBagian as string,
            id_kategori: dataIdKategori as string
        }).then(async (data) => {
            setIssues([])
            const postAddProduct = await add_product(data)
            if (postAddProduct.type !== "error") {
                toast.success("Produk Berhasil Ditambahkan")
                mutate!()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    window.location.href = '/login?expired=true'; 
                }
                toast.error("Produk Gagal Ditambahkan")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={() => { onClose(); setIssues(null) }} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Add Produk</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>

                        <div className="mb-2 row">
                            <label htmlFor="produk" className="col-sm-4 col-form-label">Nama Produk</label>
                            <div className="col-sm-8">
                                <input type="text" autoComplete="off" className="form-control" name="nama_produk" placeholder="Nama Produk" />
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

                        <div className="mb-2 row">
                            <label htmlFor="produk" className="col-sm-4 col-form-label">Bagian</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="id_bagian">
                                    <option value="">-- Pilih Bagian --</option>
                                    {!isLoadingBagian && listBagian && listBagian.map((item: any, index: number) => (
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

                        <div className="mb-2 row">
                            <label htmlFor="produk" className="col-sm-4 col-form-label">Kategori</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="id_kategori">
                                    <option value="">-- Pilih Kategori --</option>
                                    {!isLoadingKategori && listKategori && listKategori.map((item: any, index: number) => (
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

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="btn-sm" onClick={() => { onClose(); setIssues(null) }}>
                        Batal
                    </Button>

                    <button type="submit" disabled={isLoadingAdd} className="btn btn-sm btn-success" form="addForm" name="submit">{isLoadingAdd ? "Loading" : "Save"}</button>

                </Modal.Footer>

            </Modal>
        </>
    )
}
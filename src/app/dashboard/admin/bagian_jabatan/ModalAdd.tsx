import { AxiosError } from "axios"
import { checkBagian, add_bagian, useGetAllBagian, useGetAllJabatan, checkBagianJabatan, add_bagian_jabatan } from "@/app/lib/admin/users/userAPIRequest"
import { FormEvent } from "react"
import { Modal, Button } from "react-bootstrap"
import { toast, Toaster } from "react-hot-toast"
import { useState } from "react"
import { z, ZodIssue } from "zod"
import { IBagian } from "../bagian/ListBagian"

export default function ModalAdd({ show, session, onClose, mutate }: { show: boolean, session: string, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[]>([])
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)
    const { detailBagian, isLoadingBagian, error: errorBagian, mutateBagian } = useGetAllBagian(session, false)
    const { detailJabatan, isLoadingJabatan, error: errorJabatan, mutateJabatan } = useGetAllJabatan(session)

    const BagianJabatan = z.object({
        bagian: z.string().min(1, { message: "Bagian Tidak Boleh Kosong" }),
        jabatan: z.string().min(1, { message: "Jabatan Tidak Boleh Kosong" }),
    }).superRefine(async ({ bagian, jabatan }, ctx) => {
        const bagianJabatanExist = await checkBagianJabatan(bagian, jabatan, session)

        if (bagianJabatanExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Bagian vs Jabatan Sudah Terdaftar",
                path: ['jabatan']
            })
        }

        if (bagianJabatanExist.data.message == "not applicable") {
            ctx.addIssue({
                code: "custom",
                message: "Bagian or Jabatan Kosong",
                path: ['jabatan']
            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const dataBagian = data.get("bagian")
        const dataJabatan = data.get("jabatan")

        await BagianJabatan.parseAsync({
            bagian: dataBagian,
            jabatan: dataJabatan,
        }).then(async (data) => {
            setIssues([])
            const postAddBagianJabatan = await add_bagian_jabatan(data, session)
            if (postAddBagianJabatan.type !== "error") {
                toast.success("Bagian vs Jabatan Berhasil Ditambahkan")
                mutate!()
                onClose()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                toast.error("Bagian vs Jabatan Gagal Ditambahkan")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Add Bagian vs Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>

                        {/* Bagian */}
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Nama Bagian</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="bagian">
                                    {isLoadingBagian && <option>Loading....</option>}
                                    {!isLoadingBagian && detailBagian.data.map((bagian: IBagian) => (
                                        <option key={bagian.id} value={bagian.id}>{bagian.namaBagian}</option>
                                    ))}
                                </select>
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
                            <label className="col-sm-4 col-form-label">Nama Jabatan</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="jabatan">
                                    {isLoadingJabatan && <option>Loading....</option>}
                                    {!isLoadingJabatan && detailJabatan.data.map((jabatan: any) => (
                                        <option key={jabatan.id} value={jabatan.id}>{jabatan.namaJabatan}</option>
                                    ))}
                                </select>
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
                    <Button variant="danger" className="btn-sm" onClick={onClose}>
                        Batal
                    </Button>

                    <button type="submit" disabled={isLoadingAdd} className="btn btn-sm btn-success" form="addForm" name="submit">{isLoadingAdd ? "Loading" : "Save"}</button>

                </Modal.Footer>

            </Modal>
            <Toaster />
        </>
    )
}
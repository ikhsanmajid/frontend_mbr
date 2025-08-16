import { checkBagianJabatan, edit_bagian_jabatan, edit_jabatan, useGetAllBagian, useGetAllJabatan } from "@/app/lib/admin/users/userAPIRequest"
import { IBagianJabatan } from "./BagianJabatanTable"
import { Modal, Button } from "react-bootstrap"
import { useState, FormEvent, useEffect } from "react"
import { z, ZodIssue } from "zod"
import axios, { AxiosError } from "axios"
import { ToastContainer, toast } from 'react-toastify'
import { IBagian } from "../bagian/ListBagian"
import { Jabatan } from "../jabatan/JabatanTable"
import { apiURL } from "@/app/auth"

export default function ModalEdit({ show, session, onClose, editData, mutate }: { show: boolean, session: string, onClose: () => void, editData: IBagianJabatan | null, mutate: () => void }) {
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)
    const [jabatan, setJabatan] = useState<Jabatan[] | null>(null)
    const [bagian, setBagian] = useState<IBagian[] | null>(null)
    const [selectedBagian, setSelectedBagian] = useState<number | undefined>(undefined)
    const [selectedJabatan, setSelectedJabatan] = useState<number | undefined>(undefined)

    const { detailBagian, isLoadingBagian } = useGetAllBagian(session, false, undefined, undefined)
    const { detailJabatan, isLoadingJabatan } = useGetAllJabatan(session)

    useEffect(() => {
        if (isLoadingBagian) return
        if (!isLoadingBagian && detailBagian) {
            setBagian(detailBagian.data)
        }
    }, [isLoadingBagian, detailBagian])

    useEffect(() => {
        if (isLoadingJabatan) return
        if (!isLoadingJabatan && detailJabatan) {
            setJabatan(detailJabatan.data)
        }
    }, [isLoadingJabatan, detailJabatan])

    useEffect(() => {
        setSelectedBagian(editData?.idBagianFK.id)
    }, [editData?.idBagianFK.id])

    useEffect(() => {
        setSelectedJabatan(editData?.idJabatanFK.id)
    }, [editData?.idJabatanFK.id])

    // Zod Inisiasi
    const BagianJabatan = z.object({
        bagian: z.string(),
        jabatan: z.string()
    }).superRefine(async ({ jabatan, bagian }, ctx) => {
        const checkExist = await checkBagianJabatan(bagian, jabatan, session)

        if (checkExist.data.message == "exist") {
            ctx.addIssue({
                code: "custom",
                message: "Bagian vs Jabatan Sudah Ada",
                path: ['bagianjabatan']
            })
        }
    })

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()

        setIsLoadingAdd(true)

        const data = new FormData(formData.currentTarget)
        const dataJabatan = data.get("jabatan")
        const dataBagian = data.get("bagian")

        await BagianJabatan.parseAsync({
            jabatan: dataJabatan,
            bagian: dataBagian
        }).then(async (e) => {
            setIssues(null)
            const postEditJabatan = await edit_bagian_jabatan(editData?.id, e, session)
            if (postEditJabatan.type !== "error") {
                toast.success("Bagian vs Jabatan Berhasil Diupdate", {
                    autoClose: 2000
                })
                mutate()
                onClose()
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                toast.error("Bagian vs Jabatan Gagal Diupdate")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })

    }

    return (
        <>
            <Modal show={show} onHide={onClose} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Edit Bagian vs Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>
                        {/* Jabatan */}
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label">Bagian</label>
                            <div className="col-sm-8">

                                <select className="form-select" name="bagian" value={selectedBagian} onChange={(e) => setSelectedBagian(Number(e!.currentTarget.value))}>
                                    {!isLoadingBagian && bagian &&
                                        bagian.map((item: IBagian, index: number) => (
                                            <option key={index} value={item.id}>{item.namaBagian}</option>
                                        ))
                                    }
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

                        <div className="row mb-1">
                            <label className="col-sm-4 col-form-label">Jabatan</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="jabatan" value={selectedJabatan} onChange={(e) => setSelectedJabatan(Number(e!.currentTarget.value))}>
                                    {!isLoadingJabatan && jabatan &&
                                        jabatan.map((item: Jabatan, index: number) => (
                                            <option key={index} value={item.id}>{item.namaJabatan}</option>
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
                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label"></label>
                            <div className="col-sm-8">
                                <ul className="deco">
                                    {issues && issues.map((item: any, index: number) => (
                                        item.path == "bagianjabatan" &&
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
            <ToastContainer/>
        </>
    )
}
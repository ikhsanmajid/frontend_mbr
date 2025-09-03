import { AxiosError } from "axios"
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify'
import { useState, FormEvent } from "react"
import { z, ZodIssue } from "zod"
import api from "@/app/lib/axios"

export default function ModalAddWithCSV({ show, onClose, mutate }: { show: boolean, onClose: () => void, mutate: null | VoidFunction }) {
    const [issues, setIssues] = useState<ZodIssue[] | null>(null)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Validasi untuk upload CSV
    const CSVUpload = z.object({
        csv_file: z
            .instanceof(File, { message: "File harus dipilih" })
            .refine(
                (file) => file.type === "text/csv" || file.name.toLowerCase().endsWith('.csv'),
                { message: "File harus berformat CSV" }
            )
            .refine(
                (file) => file.size <= 10 * 1024 * 1024,
                { message: "Ukuran file maksimal 10MB" }
            )
    })

    async function uploadCSV(file: File) {
        const formData = new FormData()
        formData.append('csv_file', file)
        
        const uploadProcess = await api.post("/admin/product/uploadCSV", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return uploadProcess.data
    }

    async function handleSubmit(formData: FormEvent<HTMLFormElement>) {
        formData.preventDefault()
        setIsLoadingAdd(true)
        const data = new FormData(formData.currentTarget)
        const csvFile = data.get("csv_file") as File

        // Validasi file CSV
        await CSVUpload.parseAsync({
            csv_file: csvFile
        }).then(async (validatedData) => {
            setIssues([])
            const uploadResult = await uploadCSV(validatedData.csv_file)
            if (uploadResult.status === "success") {
                const { inserted, skipped } = uploadResult.data
                toast.success(
                    `File CSV berhasil diproses!\nData ditambahkan: ${inserted}\nData dilewati: ${skipped}`,
                    {
                        autoClose: 5000,
                        style: {
                            whiteSpace: 'pre-line'
                        }
                    }
                )
                onClose()
                setIssues(null)
                setSelectedFile(null)
                mutate!()
            } else {
                toast.error(uploadResult.message || "Gagal mengupload file CSV")
            }
        }).catch(e => {
            if (e instanceof z.ZodError) {
                setIssues(e.issues)
            }

            if (e instanceof AxiosError) {
                if (e.response?.status === 401) {
                    window.location.href = '/mbr/login?code=session_expired';
                }
                toast.error("File CSV Gagal Diupload")
            }
        }).finally(() => {
            setIsLoadingAdd(false)
        })
    }

    return (
        <>
            <Modal show={show} onHide={() => { onClose(); setIssues(null) }} style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Import Produk CSV</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="addForm" onSubmit={(e) => handleSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="csv_file" className="form-label fw-semibold">
                                Upload File CSV
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                className={`form-control ${issues?.find(issue => issue.path.includes('csv_file')) ? 'is-invalid' : ''}`}
                                id="csv_file"
                                name="csv_file"
                                accept=".csv"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    setSelectedFile(file || null)
                                    if (file && issues) {
                                        setIssues(issues.filter(issue => !issue.path.includes('csv_file')))
                                    }
                                }}
                                disabled={isLoadingAdd}
                            />
                            {issues?.filter(issue => issue.path.includes('csv_file')).map((issue, index) => (
                                <div key={index} className="invalid-feedback d-block">
                                    {issue.message}
                                </div>
                            ))}
                            
                            {selectedFile && (
                                <div className="mt-2 p-2 bg-light rounded">
                                    <small className="text-muted">
                                        <strong>File yang dipilih:</strong> {selectedFile.name} 
                                        <br />
                                        <strong>Ukuran:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        <br />
                                        <strong>Tipe:</strong> {selectedFile.type || 'text/csv'}
                                    </small>
                                </div>
                            )}
                            
                            <div className="mt-2">
                                <small className="text-muted">
                                    <strong>Format yang diizinkan:</strong> CSV (.csv)<br />
                                    <strong>Ukuran maksimal:</strong> 10 MB<br />
                                    <strong>Contoh format CSV:</strong> nama_produk,id_bagian,id_kategori
                                </small>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="btn-sm" onClick={() => { 
                        onClose(); 
                        setIssues(null);
                        setSelectedFile(null);
                    }}>
                        Batal
                    </Button>

                    <button 
                        type="submit" 
                        disabled={isLoadingAdd || !selectedFile} 
                        className="btn btn-sm btn-success" 
                        form="addForm" 
                        name="submit"
                    >
                        {isLoadingAdd ? "Mengupload..." : "Upload CSV"}
                    </button>
                </Modal.Footer>

            </Modal>
        </>
    )
}
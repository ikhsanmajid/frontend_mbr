import { Accordion } from "react-bootstrap";
import { useRef, useState } from "react";
import { useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest";

export default function FilterComponentProduct({ valueNamaProduk, valueBagian, statusProduct }: { valueNamaProduk: (value: string) => void, valueBagian: (value: string) => void, statusProduct: (value: string) => void }) {
    const { detailBagian, isLoadingBagian, error, mutateBagian } = useGetAllBagian(true)

    const inputSearchRef = useRef<HTMLInputElement>(null)
    const inputSelectRef = useRef<HTMLSelectElement>(null)

    const [statusActive, setStatusActive] = useState<string>("")

    function handleChangeUsed(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusActive(e.target.value)
    }

    function handleSubmit() {
        valueNamaProduk(encodeURIComponent(inputSearchRef.current!.value.toString()))
        valueBagian(inputSelectRef.current!.value.toString())
        statusProduct(statusActive)
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">

                        <div className="row mb-2">
                            <div className="col col-2 d-flex align-items-center">
                                <span>Nama Produk: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="input-group">
                                    <input ref={inputSearchRef} type="text" autoComplete="off" className="form-control" id="inputSearchBagian" />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col col-2 d-flex align-items-center">
                                <span>Nama Bagian: </span>
                            </div>
                            <div className="col col-auto">
                                <select ref={inputSelectRef} className="form-select" aria-label="Default select example" >
                                    <option value="">-- Pilih bagian --</option>
                                    {!isLoadingBagian && detailBagian != null && detailBagian.data.map((data: any, index: number) => (
                                        <option key={index} value={data.id}>{data.namaBagian}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col col-2">
                                <span>Status Aktif: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="row">
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status" id="inlineRadio4" value="active" onChange={handleChangeUsed} checked={statusActive== "active"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio4">Aktif</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status" id="inlineRadio5" value="inactive" onChange={handleChangeUsed} checked={statusActive == "inactive"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio5">Tidak Aktif</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status" id="inlineRadio6" value="" onChange={handleChangeUsed} checked={statusActive == ""}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio6">Semua</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-1 mt-1">
                            <div className="col col-auto">
                                <button className="btn btn-primary" onClick={(e) => {
                                    e.preventDefault()
                                    handleSubmit()
                                }}>Cari</button>
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
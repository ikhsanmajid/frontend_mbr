import { Accordion } from "react-bootstrap";
import { useRef, useState } from "react";
import { useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest";
import Select from 'react-select';

export default function FilterComponentProduct({ valueNamaProduk, valueBagian, statusProduct }: { valueNamaProduk: (value: string) => void, valueBagian: (value: string) => void, statusProduct: (value: string) => void }) {
    const { detailBagian, isLoadingBagian, error, mutateBagian } = useGetAllBagian(true, 1000, 0)

    const inputSearchRef = useRef<HTMLInputElement>(null)
    const [selectedBagian, setSelectedBagian] = useState<{value: string, label: string} | null>(null)

    const [statusActive, setStatusActive] = useState<string>("")

    const bagianOptions = !isLoadingBagian && detailBagian?.data ? 
        detailBagian.data.map((bagian: any) => ({
            value: bagian.id.toString(),
            label: bagian.namaBagian
        })) : []

    function handleChangeUsed(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusActive(e.target.value)
    }

    function handleSubmit() {
        valueNamaProduk(encodeURIComponent(inputSearchRef.current!.value.toString()))
        valueBagian(selectedBagian?.value || "")
        statusProduct(statusActive)
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">

                        <div className="row mb-3">
                            <div className="col-12 col-md-2 d-flex align-items-center mb-2 mb-md-0">
                                <span>Nama Produk: </span>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="input-group">
                                    <input ref={inputSearchRef} type="text" autoComplete="off" className="form-control" id="inputSearchBagian" placeholder="Ketik nama produk..." />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-2 d-flex align-items-center mb-2 mb-md-0">
                                <span>Nama Bagian: </span>
                            </div>
                            <div className="col-12 col-md-6">
                                <Select
                                    id="selectBagian"
                                    instanceId="selectBagian"
                                    isClearable
                                    isSearchable
                                    placeholder="Pilih atau ketik nama bagian..."
                                    noOptionsMessage={() => "Tidak ada bagian ditemukan"}
                                    loadingMessage={() => "Memuat data bagian..."}
                                    isLoading={isLoadingBagian}
                                    options={bagianOptions}
                                    value={selectedBagian}
                                    onChange={(option) => setSelectedBagian(option)}
                                    
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-2 mb-2 mb-md-0">
                                <span>Status Aktif: </span>
                            </div>
                            <div className="col-12 col-md-auto">
                                <div className="row g-2">
                                    <div className="col-12 col-sm-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status" id="inlineRadio4" value="active" onChange={handleChangeUsed} checked={statusActive== "active"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio4">Aktif</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status" id="inlineRadio5" value="inactive" onChange={handleChangeUsed} checked={statusActive == "inactive"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio5">Tidak Aktif</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="status" id="inlineRadio6" value="" onChange={handleChangeUsed} checked={statusActive == ""}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio6">Semua</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-1 mt-1">
                            <div className="col-12 col-md-auto">
                                <button className="btn btn-primary w-100 w-md-auto" onClick={(e) => {
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
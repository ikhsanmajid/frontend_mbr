import { Accordion } from "react-bootstrap";
import { useRef, useState } from "react";
export default function FilterComponentPermintaan({ NIKNamaFilter, StatusKonfirmasiFilter, StatusDipakaiFilter }: { NIKNamaFilter: (keyword: string) => void, StatusKonfirmasiFilter: (status: string) => void, StatusDipakaiFilter: (status: string) => void }) {
    const [keyword, setKeyword] = useState<string>("")
    const [statusUsed, setStatusUsed] = useState<string>("onlyAvailable")
    const [statusConfirmed, setStatusConfirmed] = useState<string>("all")

    function handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value)
    }

    function handleChangeUsed(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusUsed(e.target.value)
    }

    function handleChangeConfirmed(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusConfirmed(e.target.value)
    }

    function handleSubmit() {
        NIKNamaFilter(keyword)
        StatusKonfirmasiFilter(statusConfirmed)
        StatusDipakaiFilter(statusUsed)
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-1">
                            <div className="col col-2">
                                <span>NIK/Nama: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="input-group input-group-sm">
                                    <input onChange={handleKeywordChange} type="text" autoComplete="off" className="form-control" id="inputSearchBagian" />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col col-2">
                                <span>Status Konfirmasi: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="row">
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio1" value="onlyConfirmed" onChange={handleChangeConfirmed} checked={statusConfirmed == "onlyConfirmed"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio1">Dikonfirmasi</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio2" value="onlyPending" onChange={handleChangeConfirmed} checked={statusConfirmed == "onlyPending"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio2">Pending</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio4" value="onlyRejected" onChange={handleChangeConfirmed} checked={statusConfirmed == "onlyRejected"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio4">Ditolak</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio3" value="all" onChange={handleChangeConfirmed} checked={statusConfirmed == "all"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio3">Semua</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col col-2">
                                <span>Status Dipakai: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="row">
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="used" id="inlineRadio7" value="onlyUsed" onChange={handleChangeUsed} checked={statusUsed == "onlyUsed"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio7">Sudah Dipakai</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="used" id="inlineRadio5" value="onlyAvailable" onChange={handleChangeUsed} checked={statusUsed == "onlyAvailable"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio5">Belum Dipakai</label>
                                        </div>
                                    </div>
                                    <div className="col col-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="used" id="inlineRadio6" value="all" onChange={handleChangeUsed} checked={statusUsed == "all"}></input>
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
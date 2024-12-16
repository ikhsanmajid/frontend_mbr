import { Accordion } from "react-bootstrap";
import { useRef, useState } from "react";
export default function FilterComponentUser({ valueBagian, statusUser }: { valueBagian: (value: string) => void, statusUser: (value: string) => void }) {
    const inputSearchRef = useRef<HTMLInputElement>(null)
    const [statusUserSelected, setStatusUserSelected] = useState<string>("all")

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusUserSelected(e.target.value)
    }

    function handleSubmit() {
        const searchValue = inputSearchRef.current?.value
        const statusUserValue = statusUserSelected

        //console.log("radio ", statusUserValue)

        valueBagian(searchValue == undefined ? "" : searchValue)
        statusUser(statusUserValue == undefined ? "all" : statusUserValue)
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-2">
                            <div className="col col-2 d-flex align-items-center">
                                <span>Cari User: </span>
                            </div>
                            <div className="col col-4">
                                <div className="input-group">
                                    <input ref={inputSearchRef} type="text" autoComplete="off" placeholder="Ketik Nama / NIK / Email" className="form-control" id="inputSearchBagian" />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col col-2">
                                <span>Status Aktif User: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="onlyActive" onChange={handleChange} checked={statusUserSelected == "onlyActive"}></input>
                                    <label className="form-check-label" htmlFor="inlineRadio1">Aktif Saja</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="onlyInactive" onChange={handleChange} checked={statusUserSelected == "onlyInactive"}></input>
                                    <label className="form-check-label" htmlFor="inlineRadio2">Tidak Aktif Saja</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="all" onChange={handleChange} checked={statusUserSelected == "all"}></input>
                                    <label className="form-check-label" htmlFor="inlineRadio3">Semua</label>
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
"use client"
import { Accordion } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useFilterState } from "../useFilterState";


export default function FilterComponentPengembalian() {

    const [statusKembaliChoosen, setStatusKembaliChoosen] = useState<"all" | "belum">(useFilterState(state => state.statusKembali));
    
    const setStatusKembali = useFilterState(state => state.setStatusKembali)



    function handleCari() {
        if (statusKembaliChoosen) {
            setStatusKembali(statusKembaliChoosen)
        }
    }

    function handleChangeStatus(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusKembaliChoosen(e.target.value as "all" | "belum")
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-1 align-items-center">
                            <div className="col col-2">
                                <span>Status Kembali: </span>
                            </div>
                            <div className="col col-5">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="belum" onChange={handleChangeStatus} checked={statusKembaliChoosen == "belum"} />
                                    <label className="form-check-label" htmlFor="inlineRadio1">Belum Kembali Saja</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="all" onChange={handleChangeStatus} checked={statusKembaliChoosen == "all"} />
                                    <label className="form-check-label" htmlFor="inlineRadio2">Semua</label>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-1 mt-2">
                            <div className="col col-auto">
                                <button className="btn btn-primary" onClick={handleCari}>Cari</button>
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
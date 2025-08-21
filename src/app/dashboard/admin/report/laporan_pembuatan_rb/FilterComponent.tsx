"use client";
import { Accordion } from "react-bootstrap";
import { useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useFilterState } from "./useFilterState";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FilterComponentLaporanRB({ handleCari }: { handleCari: () => void }) {

    const setStartDate = useFilterState((state) => state.setStartDate);
    const date1 = useFilterState((state) => state.date1);
    const setDate1 = useFilterState((state) => state.setDate1);
    const isLoading = useFilterState((state) => state.isLoading);

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <span className="fw-bold">Filter</span>
                </Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-3 align-items-center">
                            <div className="col-12 col-md-3 mb-2 mb-md-0">
                                <span>Periode Input Pengembalian RB: </span>
                            </div>
                            <div className="col-12 col-md-auto">
                                <div className="row g-2 align-items-center">
                                    <div className="col-12 col-sm-auto">
                                        <DatePicker
                                            className="form-control"
                                            selected={date1}
                                            maxDate={new Date()}
                                            onChange={(date) => {
                                                setDate1(date)
                                                setStartDate(date == null ? null : `${date.getFullYear()}`)
                                            }}
                                            isClearable
                                            showIcon={true}
                                            icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                            showYearPicker
                                            dateFormat="yyyy"
                                        />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12">
                                        <div className="form-text" id="basic-addon4">Tahun Wajib Diisi</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-12 col-md-3 d-flex align-items-center mb-2 mb-md-0">
                                <span>Lihat Laporan: </span>
                            </div>
                            <div className="col-12 col-md-auto">
                                <button className="btn btn-primary w-100 w-md-auto" onClick={handleCari} disabled={isLoading}>
                                    Lihat
                                </button>
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

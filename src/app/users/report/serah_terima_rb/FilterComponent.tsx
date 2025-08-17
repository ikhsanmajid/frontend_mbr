"use client";
import { Accordion } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useFilterState } from "./useFilterState";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FilterComponentLaporanRB() {

    const setStartDate = useFilterState((state) => state.setStartDate);
    const setEndDate = useFilterState((state) => state.setEndDate);
    const date1 = useFilterState((state) => state.date1);
    const setDate1 = useFilterState((state) => state.setDate1);
    const date2 = useFilterState((state) => state.date2);
    const setDate2 = useFilterState((state) => state.setDate2);

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <span className="fw-bold">Filter</span>
                </Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-2 align-items-center">
                            <div className="col col-3">
                                <span>Periode Input Pengembalian RB: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="row row-cols-auto align-items-center">
                                    <div className="col">
                                        <DatePicker
                                            className="form-control"
                                            selected={date1}
                                            maxDate={new Date()} // Maksimal tanggal hari ini
                                            // Jika hari ini, waktu maksimal adalah sekarang
                                            onChange={(date) => {
                                                setDate1(date)
                                                setDate2(null)
                                                setStartDate(date == null ? null : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)
                                            }}
                                            {...(date1?.toLocaleDateString() == new Date().toLocaleDateString() && {
                                                minTime: new Date(0, 0, 0, 0, 0),
                                                // Jika hari ini, mulai dari waktu saat ini
                                                maxTime: new Date(0, 0, 0, new Date().getHours(), new Date().getMinutes())
                                            })}
                                            isClearable
                                            showTimeSelect
                                            showIcon={true}
                                            icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                            timeFormat="HH:mm"
                                            timeIntervals={5}
                                            showTimeCaption={true}
                                            timeCaption="Waktu"
                                            dateFormat="dd MMMM yyyy HH:mm"
                                        />
                                    </div>
                                    <span> s.d. </span>
                                    <div className="col">
                                        <DatePicker
                                            className="form-control"
                                            selected={date2}
                                            minDate={date1!}
                                            maxDate={new Date()}
                                            {...(date2?.toLocaleDateString() == new Date().toLocaleDateString() && {
                                                minTime: (date1?.toLocaleDateString() == new Date().toLocaleDateString() ? new Date(0, 0, 0, date1.getHours(), date1.getMinutes()) : new Date(0, 0, 0, 0, 0)),
                                                maxTime: new Date(0, 0, 0, new Date().getHours(), new Date().getMinutes() + 10)
                                            })}
                                            onChange={(date) => {
                                                setDate2(date)
                                                setEndDate(date == null ? null : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)
                                            }}
                                            isClearable
                                            showTimeSelect
                                            showIcon={true}
                                            icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                            timeFormat="HH:mm"
                                            timeIntervals={5}
                                            timeCaption="time"
                                            dateFormat="dd MMMM yyyy HH:mm"
                                            disabled={date1 === null}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-text" id="basic-addon4">Tanggal dan Waktu Wajib Diisi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

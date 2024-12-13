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

export default function FilterComponentLaporanRB({ session }: { session: string }) {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const [bagianList, setBagianList] = useState<{ value: number; label: string }[]>([]);

    const idBagian = useFilterState((state) => state.idBagian);
    const setIdBagian = useFilterState((state) => state.setIdBagian);
    const statusKembali = useFilterState((state) => state.statusKembali);
    const setStatusKembali = useFilterState((state) => state.setStatusKembali);
    const setStartDate = useFilterState((state) => state.setStartDate);
    const setEndDate = useFilterState((state) => state.setEndDate);
    const date1 = useFilterState((state) => state.date1);
    const setDate1 = useFilterState((state) => state.setDate1);
    const date2 = useFilterState((state) => state.date2);
    const setDate2 = useFilterState((state) => state.setDate2);

    const { detailBagian, isLoadingBagian } = useGetAllBagian(session);

    useEffect(() => {
        setIsMounted(true);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isLoadingBagian && detailBagian) {
            const bagianOptions = detailBagian.data.map((items: { id: number; namaBagian: string }) => ({
                value: items.id,
                label: items.namaBagian,
            }));
            setBagianList(bagianOptions);
        }

        if (isLoadingBagian) {
            setBagianList([]);
        }
    }, [isLoadingBagian, detailBagian]);

    function handleChangeStatus(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusKembali(e.target.value as "all" | "belum");
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <span className="fw-bold">Filter</span>
                </Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-2 align-items-center">
                            <div className="col col-2">
                                <span>Bagian Produksi: </span>
                            </div>
                            <div className="col col-5">
                                {isMounted && (
                                    <Select
                                        options={bagianList}
                                        onChange={(e) => setIdBagian(e!.value)}
                                        isSearchable
                                        isLoading={isLoadingBagian}
                                        value={bagianList.find((item) => item.value === idBagian) || null}
                                        placeholder="Pilih Bagian"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="row mb-2 align-items-center">
                            <div className="col col-2">
                                <span>Periode Permintaan: </span>
                            </div>
                            <div className="col col-auto">
                                <div className="row row-cols-auto align-items-center">
                                    <div className="col">
                                        <DatePicker
                                            className="form-control"
                                            selected={date1}
                                            onChange={(date) => {
                                                setDate1(date)
                                                setDate2(null)
                                                if (date !== null) setStartDate(`${date.getMonth() + 1}-${date.getFullYear()}`)
                                            }}
                                            isClearable
                                            dateFormat="MM/yyyy"
                                            showIcon={true}
                                            icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                            showMonthYearPicker></DatePicker>
                                    </div>
                                    <span> s.d. </span>
                                    <div className="col">
                                        <DatePicker
                                            className="form-control"
                                            selected={date2}
                                            minDate={date1!}
                                            onChange={(date) => {
                                                setDate2(date)
                                                if (date !== null) setEndDate(`${date.getMonth() + 1}-${date.getFullYear()}`)
                                            }}
                                            isClearable
                                            dateFormat="MM/yyyy"
                                            showIcon={true}
                                            icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                            showMonthYearPicker
                                            disabled={date1 === null}></DatePicker>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-text" id="basic-addon4">Apabila tanggal kosong akan secara otomatis memilih tahun {new Date().getFullYear()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2 align-items-center">
                            <div className="col col-2">
                                <span>Status Kembali: </span>
                            </div>
                            <div className="col col-5">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        id="inlineRadio1"
                                        value="belum"
                                        onChange={handleChangeStatus}
                                        checked={statusKembali === "belum"}
                                    />
                                    <label className="form-check-label" htmlFor="inlineRadio1">
                                        Belum Kembali Saja
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        id="inlineRadio2"
                                        value="all"
                                        onChange={handleChangeStatus}
                                        checked={statusKembali === "all"}
                                    />
                                    <label className="form-check-label" htmlFor="inlineRadio2">
                                        Semua
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

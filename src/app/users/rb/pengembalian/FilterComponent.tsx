"use client"
import { Accordion } from "react-bootstrap";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FetchAllProduk } from "@/app/lib/admin/users/userAPIRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { useFilterState } from "./useFilterState";

export default function FilterComponentPengembalian({ session }: { session: string }) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [statusKembaliChoosen, setStatusKembaliChoosen] = useState<"all" | "belum">(useFilterState(state => state.statusKembali));
    const [idProdukChoosen, setIdProdukChoosen] = useState<number | null>(useFilterState(state => state.idProduk));
    const [productList, setProductList] = useState<{ value: number; label: string }[]>([]);



    const setIdProduk = useFilterState(state => state.setIdProduk)
    const setStatusKembali = useFilterState(state => state.setStatusKembali)
    const date1 = useFilterState(state => state.date1)
    const setDate1 = useFilterState(state => state.setDate1)
    const date2 = useFilterState(state => state.date2)
    const setDate2 = useFilterState(state => state.setDate2)
    const setStartDate = useFilterState(state => state.setStartDate)
    const setEndDate = useFilterState(state => state.setEndDate)



    const { listProduk, isLoadingListProduk } = FetchAllProduk(session)

    useEffect(() => {
        setIsMounted(true);
        //     eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isLoadingListProduk && listProduk) {
            listProduk.data.map((items: { id: number, namaProduk: string }) => {
                setProductList((prev) => (
                    [...prev, { value: items.id, label: items.namaProduk }]
                ))
            })
        }

        if (isLoadingListProduk) {
            setProductList([])
        }

        //     eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingListProduk])

    function handleCari() {
        if (idProdukChoosen == null) {
            toast.error("Pilih produk terlebih dahulu");
            return
        }

        if (date1 != null && date2 == null) {
            toast.error("Tentukan Tanggal Akhir");
            return
        }


        setIdProduk(idProdukChoosen)
        setStatusKembali(statusKembaliChoosen)
        if (date1 !== null) setStartDate(`${date1!.getMonth() + 1}-${date1?.getFullYear()}`);
        if (date2 !== null) setEndDate(`${date2!.getMonth() + 1}-${date2?.getFullYear()}`)
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
                        <div className="row mb-2 align-items-center">
                            <div className="col col-2">
                                <span>Nama Produk: </span>
                            </div>
                            <div className="col col-5">
                                {isMounted && (productList.length !== 0) && <Select options={productList} onChange={(e) => { setIdProdukChoosen(e!.value) }} isSearchable isLoading={isLoadingListProduk} defaultValue={productList.find(item => { return item.value == idProdukChoosen })} />}
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
                                            }}
                                            isClearable
                                            dateFormat="MM/yyyy"
                                            showIcon={true}
                                            icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                            showMonthYearPicker
                                            disabled={date1 === null}></DatePicker>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="row mb-2 align-items-center">
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

                        <div className="row mb-1 mt-1">
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
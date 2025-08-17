"use client";
import "react-datepicker/dist/react-datepicker.css";
import { Accordion } from "react-bootstrap";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FetchAllProduk, useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useFilterState } from "./useFilterState";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

export default function FilterComponentPengembalian() {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const [productList, setProductList] = useState<{ value: number; label: string }[]>([]);
    const [bagianList, setBagianList] = useState<{ value: number; label: string }[]>([]);

    const [idProdukChoosen, setIdProdukChoosen] = useState<number | null>(useFilterState((state) => state.idProduk));
    const [idBagianChoosen, setIdBagianChoosen] = useState<number | null>(useFilterState((state) => state.idBagian));
    const [statusKembaliChoosen, setStatusKembaliChoosen] = useState<"all" | "belum" | "outstanding">(useFilterState(state => state.statusKembali));

    const idProduk = useFilterState((state) => state.idProduk);
    const setIdProduk = useFilterState((state) => state.setIdProduk);
    const idBagian = useFilterState((state) => state.idBagian);
    const setIdBagian = useFilterState((state) => state.setIdBagian);
    const setStatusKembali = useFilterState((state) => state.setStatusKembali);
    const setStartDate = useFilterState((state) => state.setStartDate);
    const setEndDate = useFilterState((state) => state.setEndDate);
    const date1 = useFilterState((state) => state.date1);
    const setDate1 = useFilterState((state) => state.setDate1);
    const date2 = useFilterState((state) => state.date2);
    const setDate2 = useFilterState((state) => state.setDate2);

    const shouldFetch = idBagianChoosen !== null

    const { listProduk, isLoadingListProduk } = FetchAllProduk(undefined, undefined, { id_bagian: idBagianChoosen?.toString() }, shouldFetch);
    const { detailBagian, isLoadingBagian } = useGetAllBagian(true);

    useEffect(() => {
        setIdProdukChoosen(null);
        setProductList([]);

        //eslint-disable-next-line
    }, [idBagianChoosen]);

    useEffect(() => {
        setIsMounted(true);
        setIdBagianChoosen(idBagian);
        setIdProdukChoosen(idProduk);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isLoadingListProduk && listProduk) {
            const produkOptions = listProduk.data.map((items: { id: number; namaProduk: string }) => ({
                value: items.id,
                label: items.namaProduk,
            }));
            setProductList(produkOptions);
        }

        if (isLoadingListProduk) {
            setProductList([]);
        }
    }, [isLoadingListProduk, listProduk]);

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


    function handleCari() {
        if (idBagianChoosen == null && statusKembaliChoosen !== "outstanding") {
            toast.error("Pilih bagian terlebih dahulu");
            return
        }

        if (idProdukChoosen == null && statusKembaliChoosen !== "outstanding") {
            toast.error("Pilih produk terlebih dahulu");
            return
        }

        if (date1 != null && date2 == null) {
            toast.error("Tentukan Tanggal Akhir");
            return
        }

        setIdProduk(idProdukChoosen);
        setIdBagian(idBagianChoosen);
        setStatusKembali(statusKembaliChoosen);
        if (date1 !== null) setStartDate(`${date1!.getMonth() + 1}-${date1?.getFullYear()}`);
        if (date2 !== null) setEndDate(`${date2!.getMonth() + 1}-${date2?.getFullYear()}`);
    }

    function handleChangeStatus(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusKembaliChoosen(e.target.value as "all" | "belum" | "outstanding");
    }

    return (
        <>
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
                                            onChange={(e) => e?.value == null ? setIdBagianChoosen(null) : setIdBagianChoosen(e.value)}
                                            isSearchable
                                            isClearable
                                            isLoading={isLoadingBagian}
                                            value={bagianList.find((item) => item.value === idBagianChoosen) || null}
                                            placeholder="Pilih Bagian"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="row mb-2 align-items-center">
                                <div className="col col-2">
                                    <span>Nama Produk: </span>
                                </div>
                                <div className="col col-5">
                                    {isMounted && !isLoadingBagian && (
                                        <Select
                                            options={productList}
                                            onChange={(e) => e?.value == null ? setIdProdukChoosen(null) : setIdProdukChoosen(e.value)}
                                            isSearchable
                                            isClearable
                                            isLoading={isLoadingListProduk}
                                            value={productList.find((item) => item.value === idProdukChoosen) || null}
                                            placeholder="Pilih Produk"
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
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="inlineRadioOptions"
                                            id="inlineRadio1"
                                            value="belum"
                                            onChange={handleChangeStatus}
                                            checked={statusKembaliChoosen === "belum"}
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
                                            value="outstanding"
                                            onChange={handleChangeStatus}
                                            checked={statusKembaliChoosen === "outstanding"}
                                        />
                                        <label className="form-check-label" htmlFor="inlineRadio2">
                                            Outstanding Saja
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="inlineRadioOptions"
                                            id="inlineRadio3"
                                            value="all"
                                            onChange={handleChangeStatus}
                                            checked={statusKembaliChoosen === "all"}
                                        />
                                        <label className="form-check-label" htmlFor="inlineRadio3">
                                            Semua
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-2 mt-1">
                                <div className="col col-auto">
                                    <button className="btn btn-primary" onClick={handleCari}>
                                        Cari
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

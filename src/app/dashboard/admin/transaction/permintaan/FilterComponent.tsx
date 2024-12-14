import "react-datepicker/dist/react-datepicker.css";
import { Accordion } from "react-bootstrap";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FetchAllProduk, useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFilterState } from "./useFilterState";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

export default function FilterComponentPermintaan({ session }: { session: string }) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("")

    const [date1, setDate1] = useState<Date | null>(null)
    const [idBagianChoosen, setIdBagianChoosen] = useState<number | null>(useFilterState((state) => state.idBagian));
    const [statusUsed, setStatusUsed] = useState<"all" | "onlyUsed" | "onlyAvailable">(useFilterState((state) => state.StatusDipakai))
    const [statusConfirmed, setStatusConfirmed] = useState<"all" | "onlyConfirmed" | "onlyPending" | "onlyRejected">(useFilterState((state) => state.StatusKonfirmasi))
    const [idProdukChoosen, setIdProdukChoosen] = useState<number | null>(useFilterState((state) => state.idProduk));
    const [bagianList, setBagianList] = useState<{ value: number | null; label: string }[]>([]);
    const [productList, setProductList] = useState<{ value: number | null; label: string }[]>([]);

    const setFilterYear = useFilterState((state) => state.setFilterYear)
    const setIdProduk = useFilterState((state) => state.setIdProduk)
    const setNIKNama = useFilterState((state) => state.setNIKNama)
    const setStatusKonfirmasi = useFilterState((state) => state.setStatusKonfirmasi)
    const setStatusDipakai = useFilterState((state) => state.setStatusDipakai)
    const setIdBagian = useFilterState((state) => state.setIdBagian)

    const shouldFetch = idBagianChoosen !== null

    const { listProduk, isLoadingListProduk } = FetchAllProduk(session, undefined, undefined, { id_bagian: idBagianChoosen?.toString() }, shouldFetch);
    const { detailBagian: listBagian, isLoadingBagian } = useGetAllBagian(session)

    useEffect(() => {
        setIsMounted(true);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        setIdProdukChoosen(null);
        setProductList([]);

        //eslint-disable-next-line
    }, [idBagianChoosen]);

    useEffect(() => {
        if (statusConfirmed === "onlyPending" || statusConfirmed === "onlyRejected") {
            setStatusUsed("all")
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusConfirmed])

    useEffect(() => {
        if (!isLoadingListProduk && listProduk) {
            listProduk.data.map((items: { id: number | null, namaProduk: string }) => {
                setProductList((prev) => (
                    [...prev, { value: items.id, label: items.namaProduk }]
                ))
            })
            setProductList((prev) => (
                [...prev, { value: null, label: "Semua" }]
            ))
        }

        if (isLoadingListProduk) {
            setProductList([])
        }

        //     eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingListProduk])

    useEffect(() => {
        if (statusConfirmed === "onlyPending" || statusConfirmed === "onlyRejected") {
            setStatusUsed("all")
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusConfirmed])

    useEffect(() => {
        if (!isLoadingBagian && listBagian) {
            listBagian.data.map((items: { id: number | null, namaBagian: string }) => {
                setBagianList((prev) => (
                    [...prev, { value: items.id, label: items.namaBagian }]
                ))
            })
            setBagianList((prev) => (
                [...prev, { value: null, label: "Semua" }]
            ))
        }

        if (isLoadingBagian) {
            setBagianList([])
        }

        //     eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingBagian])

    function handleSubmit() {
        setNIKNama(keyword)
        setStatusKonfirmasi(statusConfirmed)
        setStatusDipakai(statusUsed)
        setIdProduk(idProdukChoosen);
        setIdBagian(idBagianChoosen);
        setFilterYear(date1 == null ? null : date1?.getFullYear());
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="col col-6">
                            <div className="row mb-2 row mb-2 align-items-center">
                                <div className="col col-3">
                                    <span>NIK/Nama: </span>
                                </div>
                                <div className="col col-8">
                                    <div className="input-group">
                                        <input onChange={(e) => {
                                            setKeyword(e.target.value)
                                        }} type="text" autoComplete="off" className="form-control" id="inputSearchBagian" />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-2 align-items-center">
                                <div className="col col-3">
                                    <span>Bagian: </span>
                                </div>
                                <div className="col col-8">
                                    {isMounted && (
                                        <Select
                                            options={bagianList}
                                            onChange={(e) => setIdBagianChoosen(e!.value)}
                                            isSearchable
                                            isLoading={isLoadingBagian}
                                            value={bagianList.find((item) => item.value === idBagianChoosen) || null}
                                            placeholder="Pilih Bagian"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="row mb-2 align-items-center">
                                <div className="col col-3">
                                    <span>Nama Produk: </span>
                                </div>
                                <div className="col col-8">
                                    {isMounted && !isLoadingBagian && (
                                        <Select
                                            options={productList}
                                            onChange={(e) => setIdProdukChoosen(e!.value)}
                                            isSearchable
                                            //isLoading={isLoadingListProduk}
                                            value={productList.find((item) => item.value === idProdukChoosen) || null}
                                            placeholder="Pilih Produk"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="row mb-2 align-items-center">
                                <div className="col col-3">
                                    <span>Tahun Permintaan: </span>
                                </div>
                                <div className="col col-8">
                                    <div className="row row-cols-auto align-items-center">
                                        <div className="col">
                                            <DatePicker
                                                className="form-control"
                                                selected={date1}
                                                onChange={(date) => {
                                                    setDate1(date)
                                                }}
                                                isClearable
                                                dateFormat="yyyy"
                                                showIcon={true}
                                                icon={<FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>}
                                                showYearPicker
                                            ></DatePicker>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col col-auto">
                            <div className="row mb-2 row mb-2 align-items-center">
                                <div className="col col-2">
                                    <span>Status Konfirmasi: </span>
                                </div>
                                <div className="col col-auto">
                                    <div className="row">
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio1" value="onlyConfirmed" onChange={(e) => {
                                                    setStatusConfirmed(e.target.value as "onlyConfirmed" | "onlyPending" | "onlyRejected" | "all")
                                                }} checked={statusConfirmed == "onlyConfirmed"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio1">Dikonfirmasi</label>
                                            </div>
                                        </div>
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio2" value="onlyPending" onChange={(e) => {
                                                    setStatusConfirmed(e.target.value as "onlyConfirmed" | "onlyPending" | "onlyRejected" | "all")
                                                }} checked={statusConfirmed == "onlyPending"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio2">Pending</label>
                                            </div>
                                        </div>
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio4" value="onlyRejected" onChange={(e) => {
                                                    setStatusConfirmed(e.target.value as "onlyConfirmed" | "onlyPending" | "onlyRejected" | "all")
                                                }} checked={statusConfirmed == "onlyRejected"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio4">Ditolak</label>
                                            </div>
                                        </div>
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="confirmed" id="inlineRadio3" value="all" onChange={(e) => {
                                                    setStatusConfirmed(e.target.value as "onlyConfirmed" | "onlyPending" | "onlyRejected" | "all")
                                                }} checked={statusConfirmed == "all"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio3">Semua</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(statusConfirmed !== "onlyPending" && statusConfirmed !== "onlyRejected") && <div className="row mb-2 row mb-2 align-items-center">
                                <div className="col col-2">
                                    <span>Status Dipakai: </span>
                                </div>
                                <div className="col col-auto">
                                    <div className="row">
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="used" id="inlineRadio7" value="onlyUsed" onChange={(e) => {
                                                    setStatusUsed(e.target.value as "onlyUsed" | "onlyAvailable" | "all")
                                                }} checked={statusUsed == "onlyUsed"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio7">Sudah Dipakai</label>
                                            </div>
                                        </div>
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="used" id="inlineRadio5" value="onlyAvailable" onChange={(e) => {
                                                    setStatusUsed(e.target.value as "onlyUsed" | "onlyAvailable" | "all")
                                                }} checked={statusUsed == "onlyAvailable"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio5">Belum Dipakai</label>
                                            </div>
                                        </div>
                                        <div className="col col-auto">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="used" id="inlineRadio6" value="all" onChange={(e) => {
                                                    setStatusUsed(e.target.value as "onlyUsed" | "onlyAvailable" | "all")
                                                }} checked={statusUsed == "all"}></input>
                                                <label className="form-check-label" htmlFor="inlineRadio6">Semua</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
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
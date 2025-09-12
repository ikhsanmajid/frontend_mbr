import { Accordion } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import Select from "react-select";
import { useGetAllBagian } from "@/app/lib/admin/users/userAPIRequest";

export default function FilterComponentUser({ valueBagian, statusUser, idBagianSearch }: { valueBagian: (value: string) => void, statusUser: (value: string) => void , idBagianSearch: (value: string | null) => void}) {
    const inputSearchRef = useRef<HTMLInputElement>(null)
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [statusUserSelected, setStatusUserSelected] = useState<string>("all")

    const { detailBagian, isLoadingBagian } = useGetAllBagian(false);

    const [bagianList, setBagianList] = useState<{ value: number; label: string }[]>([]);

    const [idBagian, setIdBagian] = useState<number | null>(null)

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStatusUserSelected(e.target.value)
    }

    function handleSubmit() {
        const searchValue = inputSearchRef.current?.value
        const statusUserValue = statusUserSelected
        const idBagianValue = idBagian

        //console.log("radio ", statusUserValue)

        valueBagian(searchValue == undefined ? "" : searchValue)
        statusUser(statusUserValue == undefined ? "all" : statusUserValue)
        idBagianSearch(idBagianValue !== null ? String(idBagianValue) : null )
    }

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-3">
                            <div className="col-12 col-md-2 d-flex align-items-center mb-2 mb-md-0">
                                <span>Cari User: </span>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="input-group">
                                    <input ref={inputSearchRef} type="text" autoComplete="off" placeholder="Ketik Nama / NIK / Email" className="form-control" id="inputSearchBagian" />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                            <div className="col-12 col-md-2 mb-2 mb-md-0">
                                <span>Bagian Produksi: </span>
                            </div>
                            <div className="col-12 col-md-6">
                                {isMounted && (
                                    <Select
                                        options={bagianList}
                                        onChange={(e) => e?.value == null ? setIdBagian(null) : setIdBagian(e.value)}
                                        isSearchable
                                        isClearable
                                        isLoading={isLoadingBagian}
                                        value={bagianList.find((item) => item.value === idBagian) || null}
                                        placeholder="Pilih Bagian"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-2 mb-2 mb-md-0">
                                <span>Status Aktif User: </span>
                            </div>
                            <div className="col-12 col-md-auto">
                                <div className="row g-2">
                                    <div className="col-12 col-sm-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="onlyActive" onChange={handleChange} checked={statusUserSelected == "onlyActive"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio1">Aktif Saja</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="onlyInactive" onChange={handleChange} checked={statusUserSelected == "onlyInactive"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio2">Tidak Aktif Saja</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="all" onChange={handleChange} checked={statusUserSelected == "all"}></input>
                                            <label className="form-check-label" htmlFor="inlineRadio3">Semua</label>
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
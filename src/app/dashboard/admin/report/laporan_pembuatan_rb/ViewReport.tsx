"use client"
import { Toaster, toast } from "react-hot-toast";
import FilterComponentLaporanRB from "./FilterComponent";
import { useFilterState } from "./useFilterState";
import { apiURL } from "@/app/lib/admin/users/userAPIRequest";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function DownloadRB({ session }: { session: string }) {
    const [data, setData] = useState<any[any] | null>(null);

    const isLoading = useFilterState((state) => state.isLoading);
    const setIsLoading = useFilterState((state) => state.setIsLoading);
    const startDate = useFilterState((state) => state.startDate);

    async function handleDownload() {

        if (startDate == null) {
            toast.error("Tahun Wajib Diisi");
            return
        }

        try {
            setIsLoading(true);
            let query = `${apiURL}/admin/product_rb/generateReportPembuatanRB?tahun=${startDate}`;

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            if (response.status === 200) {
                setData(response.data);
            }

            setIsLoading(false);
        } catch (error) {
            toast.error("Gagal Me-request Data");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        console.log("data: ", data)
    }, [isLoading, data])
    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                <>Download Laporan Serah Terima RB</>
            </div>
            <div className="card-body">
                <div className="row">
                    <FilterComponentLaporanRB
                        handleCari={handleDownload}
                    />
                </div>

                <div className="row mb-2 mt-3">
                    <h2 className="mb-4">Daftar Pembuatan RB {data == null ? "-" : data.data[0].waktu.split(" ")[1]}</h2>
                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered align-middle text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col" className="align-middle" rowSpan={2}>No</th>
                                    <th scope="col" className="align-middle" rowSpan={2}>Periode</th>
                                    <th scope="col" className="align-middle" colSpan={2}>Bagian Produksi</th>
                                    <th scope="col" className="align-middle" rowSpan={2}>Terlambat H+2</th>
                                    <th scope="col" className="align-middle" rowSpan={2}>Total</th>
                                </tr>
                                <tr>
                                    <th scope="col" className="align-middle" >Farmasi</th>
                                    <th scope="col" className="align-middle">Food</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data == null && (<tr><td colSpan={6}>Data Kosong</td></tr>)}
                                {isLoading && (<tr><td colSpan={6}>Loading...</td></tr>)}
                                {data && data.data.map((item: any, index: any) => {
                                    const farmasi = item.data.find((d: any) => d.namaJenisBagian === 'Farmasi') || { total: 0, late: 0 };
                                    const food = item.data.find((d: any) => d.namaJenisBagian === 'Food') || { total: 0, late: 0 };

                                    // Konversi nilai ke integer untuk memastikan perhitungan benar
                                    const farmasiTotal = parseInt(farmasi.total) || 0;
                                    const farmasiLate = parseInt(farmasi.late) || 0;

                                    const foodTotal = parseInt(food.total) || 0;
                                    const foodLate = parseInt(food.late) || 0;

                                    // Hitung total
                                    const totalLate = farmasiLate + foodLate;
                                    const totalAll = farmasiTotal + foodTotal;

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.waktu}</td>
                                            <td>{farmasi.total === 0 ? "-" : farmasi.total}</td>
                                            <td>{food.total === 0 ? "-" : food.total}</td>
                                            <td>{totalLate}</td>
                                            <td>{totalAll}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Toaster />
            </div>
            <div className="card-footer d-flex justify-content-between px-4 pt-3">
            </div>
        </div>
    )
}
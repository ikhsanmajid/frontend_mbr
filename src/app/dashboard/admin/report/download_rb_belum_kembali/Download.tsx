"use client"
import { Toaster, toast } from "react-hot-toast";
import FilterComponentLaporanRB from "./FilterComponent";
import { useFilterState } from "./useFilterState";
import { apiURL } from "@/app/lib/admin/users/userAPIRequest";
import axios from "axios";
import { useState } from "react";

export default function DownloadRB({ session }: { session: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const idBagian = useFilterState((state) => state.idBagian);
    const startDate = useFilterState((state) => state.startDate);
    const endDate = useFilterState((state) => state.endDate);
    const statusKembali = useFilterState((state) => state.statusKembali);

    async function handleDownload() {
        if (idBagian == null) {
            toast.error("Pilih bagian terlebih dahulu");
            return
        }

        if (startDate != null && endDate == null) {
            toast.error("Tentukan Tanggal Akhir");
            return
        }

        try {
            setIsLoading(true);
            let query = `${apiURL}/admin/product_rb/generateReport?idBagian=${idBagian}&statusKembali=${statusKembali}`;

            if (startDate !== null && endDate !== null) {
                query += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await axios.get(query, {
                responseType: "blob"
            });

            const contentType = response.headers["content-type"];
            if (contentType.includes("application/json")) {
                const json = await response.data.text();
                const parsedData = JSON.parse(json);
                toast.success(parsedData.message);
                setIsLoading(false);
                return;
            }

            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            console.log("Content ", response)
            const fileName = contentDisposition
                ? contentDisposition.split("filename=")[1].replace(/"/g, "")
                : "downloaded_file";

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setIsLoading(false);
        } catch (error) {
            toast.error("Gagal Me-request Data");
            setIsLoading(false);
        }
    }
    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between">
                <>Download Laporan RB Belum Kembali</>
            </div>
            <div className="card-body">
                <div className="row">
                    <FilterComponentLaporanRB
                        session={session}
                    />
                </div>

                <div className="row mb-2 mt-3">
                    <div className="col col-2 d-flex align-items-center">
                        <span>Download Laporan: </span>
                    </div>
                    <div className="col col-auto">
                        <button className="btn btn-primary" onClick={handleDownload} disabled={isLoading}>
                            Download
                        </button>
                    </div>
                </div>
                <Toaster />
            </div>
            <div className="card-footer d-flex justify-content-between px-4 pt-3">
            </div>
        </div>
    )
}
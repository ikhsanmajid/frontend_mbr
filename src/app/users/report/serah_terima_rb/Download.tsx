"use client"
import { toast } from 'react-toastify';
import { useFilterState } from "./useFilterState";
import { useState } from "react";
import api from '@/app/lib/axios';
import FilterComponentLaporanRB from "./FilterComponent";

export default function DownloadRB() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startDate = useFilterState((state) => state.startDate);
    const endDate = useFilterState((state) => state.endDate);

    async function handleDownload() {

        if (startDate == null && endDate == null) {
            toast.error("Tanggal dan Waktu Wajib Diisi");
            return
        }

        if (startDate != null && endDate == null) {
            toast.error("Tentukan Tanggal Akhir");
            return
        }

        try {
            setIsLoading(true);
            let query = `users/rb/generateReportSerahTerima/?startDate=${startDate}&endDate=${endDate}`;

            const response = await api.get(query, {
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
            //("Content ", response)
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
                <>Download Laporan Serah Terima</>
            </div>
            <div className="card-body">
                <div className="row">
                    <FilterComponentLaporanRB />
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
            </div>
            <div className="card-footer d-flex justify-content-between px-4 pt-3">
            </div>
        </div>
    )
}
"use client"
import { GetDashboardDataUser } from "@/app/lib/admin/users/userAPIRequest";
import { useState, useEffect } from "react";

interface IGetDashboardDataUser {
    count: number | string;
    namaBagian?: string;
    namaJenisBagian?: string;
}

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<IGetDashboardDataUser[] | null>(null);
    const [dataRBDibuat, setDataRBDibuat] = useState<IGetDashboardDataUser[] | null>(null);
    const [time, setTime] = useState<string | null>(null);

    const { listDashboardData, isLoadingListDashboardData, error, mutateListDashboardData } = GetDashboardDataUser();

    useEffect(() => {
        if (!isLoadingListDashboardData && listDashboardData) {
            setDashboardData(listDashboardData.data.RBBelumKembali);
            setDataRBDibuat(listDashboardData.data.RBDibuat);
        }
        if (isLoadingListDashboardData) {
            setDashboardData(null);
        }
        if (error) {
            console.log(error);
        }
    }, [isLoadingListDashboardData, listDashboardData, error]);

    // async function getServerTime(){
    //     try{
    //         const response = await axios.get(`${apiURL}/time`);
    //         if(response.status == 200){
    //             setTime(response.data.time)
    //             return
    //         }
            
    //     }catch(err){
    //         console.log(err);
    //     }
    // }

    // useEffect(() => {
        
    //     console.log(time)
    // },[])

    return (
        <div className="row overflow-y-auto">

            <div className="row justify-content-center">
                {isLoadingListDashboardData && <div className="text-center">Loading...</div>}
                {!isLoadingListDashboardData && (
                    <>
                        <h2 className="text-center mb-4">
                            Jumlah RB yang Belum Kembali s.d {new Date(new Date().setMonth(new Date().getMonth() - 2)).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
                        </h2>
                        {dashboardData && dashboardData.map((data, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-3 g-4">
                                <div className="card card-dashboard bg-light shadow">
                                    <div className="card-header bg-primary text-white text-center">
                                        <h6 className="mb-0">{data.namaBagian}</h6>
                                    </div>
                                    <div className="card-body text-center">
                                        <h3 className="text-bold">{data.count}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="row justify-content-center mt-5">
                {isLoadingListDashboardData && <div className="text-center">Loading...</div>}
                {!isLoadingListDashboardData && (
                    <>
                        <h2 className="text-center mb-4">
                            Jumlah Permintaan RB Tahun {new Date().getFullYear()}
                        </h2>
                        {dataRBDibuat && dataRBDibuat.map((data, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-3 g-4">
                                <div className="card card-dashboard bg-light shadow">
                                    <div className="card-header bg-primary text-white text-center">
                                        <h6 className="mb-0">{data.namaBagian}</h6>
                                    </div>
                                    <div className="card-body text-center">
                                        <h3 className="text-bold">{data.count}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

        </div>
    )
}
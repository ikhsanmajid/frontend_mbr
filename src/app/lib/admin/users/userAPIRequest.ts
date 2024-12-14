// import { fetcher } from "../../fetcher";
"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

export const apiURL = process.env.NEXT_PUBLIC_APIENDPOINT_URL as string


export const apiRequest = axios.create({
    baseURL: apiURL
});

apiRequest.interceptors.request.use((config) => {
    return config
}, (error) => {
    Promise.reject(error)
})

export const fetcher = ([endpoint, options]: [string, object]) => apiRequest.get(endpoint, options).then(res => { return res.data })

//SECTION - User API Endpoint
//ANCHOR - Get Semua Users
export function FetchAllUser(session: string | undefined, limit?: number, offset?: number, params?: { search_user?: string, active?: string }) {
    const [listUser, setListUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingUser(true)
            setError(null)

            let query: string = `${apiURL}/admin/users/findAll?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListUser(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingUser(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, limit, offset, params?.active, params?.search_user])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateUser = useCallback(() => {
        fetchData()
    }, [fetchData])



    return {
        listUser, isLoadingUser, error, mutateUser
    }
}

//ANCHOR - Delete User by Id
export async function deleteUser(deleteData: any, session: string) {
    const processDelete = await fetch(apiURL + "/admin/users/deleteUser/" + deleteData.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}

//ANCHOR - Tambah Bagian Jabatan ke User
export async function addBagianJabatan(data: any, session: string) {
    const addProcess = await axios.post(apiURL + "/admin/users/addUserJabatan", {
        "idBagianJabatan": data.idBagianJabatan,
        "idUser": data.idUser
    }, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return addProcess
}

//ANCHOR - Update User
export async function updateDataUser({ data, session }: { data: { [key: string]: string | number }, session: string }) {
    const updateProcess = await axios.patch(`${apiURL}/admin/users/updateUser/${data.id}`, {
        email: data.email,
        nik: data.nik,
        nama: data.nama,
        password: data.password == "default" ? "" : data.password,
        is_admin: data.isAdmin,
        is_active: data.isActive,
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }

    })

    return updateProcess
}

//ANCHOR - Update User
export async function updateDataUserBagianJabatan(data: { id: string, idBagianJabatan: string }, session: string) {
    const updateProcess = await axios.patch(`${apiURL}/admin/users/updateUserJabatan`, {
        id: data.id,
        idBagianJabatan: data.idBagianJabatan
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }

    })

    return updateProcess
}

//ANCHOR - Get Detail User by Id
export function GetDetailUserInfo(id: number, session: string) {

    const { data: detailUser, isLoading, mutate } = useSWRImmutable(["/admin/users/detail/" + id.toString(), {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    }], fetcher)

    return {
        detailUser,
        detailUserLoading: isLoading,
        mutateUser: mutate
    }
}

//ANCHOR - Delete Jabatan User By Id
export async function deleteBagianJabatanUser(id: string, session: string) {
    const processDelete = await axios.delete(apiURL + "/admin/users/deleteJabatan/" + id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}

//ANCHOR - Check Email Exist
export async function checkEmail(email: string, session: string) {
    const emailCheck = await axios(apiURL + "/admin/users/checkEmail/?email=" + email, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return emailCheck
}
//!SECTION

//SECTION - Bagian API Endpoint
//ANCHOR - Get Semua Bagian Axios
export function useGetAllBagian(session: string | undefined, onlyManufactur: boolean, limit?: number, offset?: number, params?: { [key: string]: string }) {
    const [detailBagian, setDetailBagian] = useState<any>(null);
    const [isLoadingBagian, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const query = `limit=${limit}&offset=${offset}&search=${params?.search}`;

            if (limit != undefined) {
                const response = await axios.get(`${apiURL}/admin/department/findAll?manufaktur=${onlyManufactur ? "yes" : "no"}&${query}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session}`
                    }
                });

                setDetailBagian(response.data);
            } else {
                const response = await axios.get(`${apiURL}/admin/department/findAll?manufaktur=${onlyManufactur ? "yes " : "no"}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session}`
                    }
                });
                setDetailBagian(response.data);
            }

        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [session, limit, offset, params?.search, onlyManufactur]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Return mutate function
    const mutateBagian = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { detailBagian, isLoadingBagian, error, mutateBagian };
}

//ANCHOR - Tambah Bagian
export async function add_bagian(data: any, session: string) {
    const addProcess = axios.post(apiURL + "/admin/department/addDepartment", {
        nama_bagian: data.bagian,
        kategori: data.kategori
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return (await addProcess).data
}

//ANCHOR - Check Bagian by Name
export async function checkBagian(bagian: string, session: string) {
    const bagianCheck = await axios(apiURL + "/admin/department/findFixedDepartment/?nama_bagian=" + bagian, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return bagianCheck
}

//ANCHOR - Update Bagian by Id
export async function edit_bagian(id: number | undefined, data: any, session: string) {

    const editProcess = await axios.patch(apiURL + "/admin/department/updateDepartment/" + id, {
        nama_bagian: data.bagian,
        is_active: data.active == "1" ? "true" : "false",
        kategori: data.kategori
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return editProcess.data
}

//ANCHOR - Delete Bagian by Id
export async function deleteBagian(deleteData: any, session: string) {
    const processDelete = await fetch(apiURL + "/admin/department/deleteDepartment/" + deleteData.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}
//!SECTION



//SECTION - Jabatan API Endpoint
//ANCHOR - Get Semua Jabatan Axios
export function useGetAllJabatan(session: string | undefined, limit?: number, offset?: number) {
    const [detailJabatan, setDetailJabatan] = useState<any>(null);
    const [isLoadingJabatan, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const query = `?limit=${limit}&offset=${offset}`;
            if (limit != undefined) {
                const response = await axios.get(`${apiURL}/admin/employment/findAll${query}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session}`
                    }
                });
                setDetailJabatan(response.data);
            } else {
                const response = await axios.get(`${apiURL}/admin/employment/findAll`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session}`
                    }
                });
                setDetailJabatan(response.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [session, limit, offset]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Return mutate function
    const mutateJabatan = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { detailJabatan, isLoadingJabatan, error, mutateJabatan };
}

//ANCHOR - Get List Jabatan by Id Bagian
export async function GetJabatanByIDBagian(id: string, session: string) {
    const listJabatan = await axios.get(apiURL + "/admin/department_employment/findJabatan/" + id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return listJabatan.data
}

//ANCHOR - Update Jabatan by Id
export async function edit_jabatan(id: number | undefined, data: any, session: string) {

    const editProcess = await axios.patch(apiURL + "/admin/employment/updateEmployment/" + id, {
        nama_jabatan: data.jabatan,
        is_active: data.active == "1" ? "true" : "false"
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return editProcess.data
}

//ANCHOR - Check Bagian by Name
export async function checkJabatan(jabatan: string, session: string) {
    const jabatanCheck = await axios(apiURL + "/admin/employment/findFixedEmployment/?nama_jabatan=" + jabatan, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return jabatanCheck
}

//ANCHOR - Delete Jabatan by Id
export async function deleteJabatan(deleteData: any, session: string) {
    const processDelete = await fetch(apiURL + "/admin/employment/deleteEmployment/" + deleteData.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}
//!SECTION


//SECTION - Bagian vs Jabatan API Endpoint
//ANCHOR - Get All Bagian vs Jabatan Axios
export function useGetAllBagianJabatan(session: string | undefined, limit?: number, offset?: number, sort?: "asc" | "desc") {
    const [detailBagianJabatan, setDetailBagianJabatan] = useState<any>(null);
    const [isLoadingBagianJabatan, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const query = `?limit=${limit ?? 10}&offset=${offset ?? 0}${sort ?? "&sort=" + sort}`;
            const response = await axios.get(`${apiURL}/admin/department_employment/findAll${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });
            setDetailBagianJabatan(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [session, limit, offset, sort]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Return mutate function
    const mutateBagianJabatan = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { detailBagianJabatan, isLoadingBagianJabatan, error, mutateBagianJabatan };
}

//ANCHOR - Tambah Bagian Jabatan
export async function add_bagian_jabatan(data: any, session: string) {
    const addProcess = axios.post(apiURL + "/admin/department_employment/addDepartmentEmployment", {
        id_bagian: data.bagian,
        id_jabatan: data.jabatan
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return (await addProcess).data
}

//ANCHOR - Check Bagian by Name
export async function checkBagianJabatan(bagian: string, jabatan: string, session: string) {

    const bagianJabatanCheck = await axios(apiURL + "/admin/department_employment/findFixedDepartmentEmployment/?id_bagian=" + bagian + "&id_jabatan=" + jabatan, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    //console.log("api req ", bagianJabatanCheck)

    return bagianJabatanCheck
}

//ANCHOR - Delete Bagian Jabatan by Id
export async function deleteBagianJabatan(deleteData: any, session: string) {
    const processDelete = await fetch(apiURL + "/admin/department_employment/deleteDepartmentEmployment/" + deleteData.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}


//!SECTION

//SECTION - User API Endpoint
//ANCHOR - Get Semua Produk
export function FetchAllProduk(session: string | undefined, limit?: number, offset?: number, params?: { nama_produk?: string, id_bagian?: string, status?: string }, shouldFetch: boolean = true) {
    const [listProduk, setListProduk] = useState<any>(null);
    const [isLoadingListProduk, setIsLoadingListProduk] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (!shouldFetch) {
            setIsLoadingListProduk(false)
            return
        }
        try {
            setIsLoadingListProduk(true)
            setError(null)

            let query: string = `${apiURL}/admin/product/getProduct?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (typeof params !== "undefined") {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value !== null && typeof value !== "undefined") {
                        query += `${key}=${value}&`
                    }
                }
            }

            //console.log("query ", {params})    

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListProduk(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListProduk(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, limit, offset, params?.id_bagian, params?.nama_produk, params?.status])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListProduk = useCallback(() => {
        fetchData()
    }, [fetchData])



    return {
        listProduk, isLoadingListProduk, error, mutateListProduk
    }
}

//ANCHOR - Delete Produk
export async function deleteProduk(deleteData: any, session: string) {
    const processDelete = await fetch(apiURL + "/admin/product/deleteProduct/" + deleteData.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}

//ANCHOR - Edit Produk
export async function edit_produk(id: number | undefined, data: any, session: string) {
    const editProcess = await axios.put(apiURL + "/admin/product/editProduct/" + id, {
        nama_produk: data.nama_produk,
        id_bagian: data.id_bagian,
        id_kategori: data.id_kategori,
        is_active: data.active
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return editProcess.data
}
//!SECTION


//SECTION - Flow Permintaan RB
//ANCHOR - Tambah Permintaan RB
export async function addPermintaanNomor(data: any, session: string) {
    const addProcess = await axios.post(apiURL + "/users/rb/addRequestRB", {
        data: data
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    });

    return addProcess.data;
}

//ANCHOR - Edit Permintaan RB
export async function editPermintaanNomor(oldid: number, data: any, session: string) {
    const addProcess = await axios.post(apiURL + "/users/rb/editRequestRB", {
        data: data,
        oldid: oldid
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    });

    return addProcess.data;
}

//ANCHOR - Mark Sudah Dipakai Permintaan RB
export async function usedPermintaanNomor(id: number, session: string) {
    const addProcess = await axios.put(apiURL + `/users/rb/usedRequestRB/${id}`, {}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    });

    return addProcess.data;
}

//ANCHOR - Get Permintaan RB User
export function GetPermintaanRB(session: string | undefined, limit?: number, offset?: number, params?: { status?: string, used?: string | boolean, keyword?: string | null, idProduk?: number | null, year: number | null }) {
    const [listPermintaan, setListPermintaan] = useState<any>(null);
    const [isLoadingListPermintaan, setIsLoadingListPermintaan] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPermintaan(true)
            setError(null)

            let query: string = `${apiURL}/users/rb/listRequestRB?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, limit, offset, params?.status, params?.used, params?.keyword, params?.idProduk, params?.year])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPermintaan = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listPermintaan, isLoadingListPermintaan, error, mutateListPermintaan
    }
}

//ANCHOR - Get Permintaan RB Admin
export function GetPermintaanRBAdmin(session: string | undefined, limit?: number, offset?: number, params?: { status?: string, used?: string | boolean, keyword?: string | null, idProduk?: number | null, idBagian?: number | null, year?: number | null }) {
    const [listPermintaan, setListPermintaan] = useState<any>(null);
    const [isLoadingListPermintaan, setIsLoadingListPermintaan] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPermintaan(true)
            setError(null)

            let query: string = `${apiURL}/admin/product_rb/listPermintaan?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, limit, offset, params?.status, params?.used, params?.keyword, params?.idProduk, params?.idBagian, params?.year])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPermintaan = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listPermintaan, isLoadingListPermintaan, error, mutateListPermintaan
    }
}

//ANCHOR - Get List Detail Permintaan By ID
export function GetDetailPermintaan(session: string | undefined, id: number | null) {
    const [detailPermintaan, setDetailPermintaan] = useState<any>(null);
    const [isLoadingPermintaan, setIsLoadingPermintaan] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);



    const fetchData = useCallback(async () => {
        try {
            setIsLoadingPermintaan(true)
            setError(null)

            if (id === null) {
                throw new Error("ID is required")
            }

            let query: string = `${apiURL}/admin/product_rb/listDetailPermintaan?id=${id}`

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setDetailPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPermintaan = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        detailPermintaan, isLoadingPermintaan, error, mutateListPermintaan
    }
}

//ANCHOR - Get List Detail Permintaan Nomor By ID
export function GetDetailPermintaanNomor(session: string | undefined, id: number | null) {
    const [detailPermintaanNomor, setDetailPermintaan] = useState<any>(null);
    const [isLoadingPermintaanNomor, setIsLoadingPermintaan] = useState<boolean>(true);
    const [errorNomor, setError] = useState<any>(null);



    const fetchData = useCallback(async () => {
        try {
            setIsLoadingPermintaan(true)
            setError(null)

            if (id === null) {
                throw new Error("ID is required")
            }

            let query: string = `${apiURL}/admin/product_rb/listNomorUrutByIdPermintaan?id=${id}`

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setDetailPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPermintaanNomor = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        detailPermintaanNomor, isLoadingPermintaanNomor, errorNomor, mutateListPermintaanNomor
    }
}

//ANCHOR - Konfirmasi / Tolak Permintaan
export async function confirmPermintaan(data: any, session: string, action: "confirm" | "reject", reason?: string) {
    const confirmProcess = await axios.post(apiURL + "/admin/product_rb/confirmPermintaan/" + data.id, {
        action: action,
        reason: reason
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return confirmProcess
}
//!SECTION

//SECTION - Kategori API Endpoint
//ANCHOR - Get Semua Kategori
export function FetchAllKategori(session: string | undefined, limit?: number, offset?: number, params?: { search_kategori?: string }) {
    const [detailKategori, setDetailKategori] = useState<any>(null);
    const [isLoadingKategori, setIsLoadingKategori] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingKategori(true)
            setError(null)

            let query: string = `${apiURL}/admin/product/getKategori?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setDetailKategori(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingKategori(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, limit, offset, params?.search_kategori])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListKategori = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        detailKategori, isLoadingKategori, error, mutateListKategori
    }
}

//ANCHOR - Check Bagian by Name
export async function checkCategory(kategori: string, session: string) {
    const bagianCheck = await axios(apiURL + "/admin/product/checkKategori/?nama_kategori=" + kategori, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return bagianCheck
}

//ANCHOR - Update Kategori by Id
export async function edit_kategori(id: string | number | undefined, data: any, session: string) {

    const editProcess = await axios.patch(apiURL + "/admin/product/updateCategory/" + id, {
        nama_kategori: data.namaKategori,
        starting_number: data.startingNumber,
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return editProcess.data
}

//ANCHOR - Delete Kategori by Id
export async function deleteCategory(deleteData: any, session: string) {
    const processDelete = await fetch(apiURL + "/admin/product/deleteCategory/" + deleteData.id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return processDelete
}

//ANCHOR - Tambah Bagian
export async function add_kategori(data: any, session: string) {
    const addProcess = axios.post(apiURL + "/admin/product/addCategory", {
        nama_kategori: data.namaKategori,
        starting_number: data.startingNumber
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session
        }
    })

    return (await addProcess).data
}

//ANCHOR - Pengembalian RB
export function GetAllReturnRBByProduct(session: string, id: any, limit?: number, offset?: number, params?: { number?: string | null, status?: string, startDate?: string | null, endDate?: string | null }) {
    const [listPengembalian, setListPengembalian] = useState<any>(null);
    const [isLoadingListPengembalian, setIsLoadingListPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPengembalian(true)
            setError(null)

            if (id === null) {
                throw new Error("Pilih Produk Terlebih Dahulu")
            }

            let query: string = `${apiURL}/users/rb/getRBReturnByProduct/${id}?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, id, limit, offset, params?.status, params?.startDate, params?.endDate, params?.number])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPengembalian = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian
    }
}

//ANCHOR - Pengembalian RB
export function GetAllReturnRBByProductAndIdPermintaan(session: string, idProduk: any, idPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
    const [listPengembalian, setListPengembalian] = useState<any>(null);
    const [isLoadingListPengembalian, setIsLoadingListPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPengembalian(true)
            setError(null)

            if (idProduk === null) {
                throw new Error("Pilih Produk Terlebih Dahulu")
            }

            if (idPermintaan === null) {
                throw new Error("ID Permintaan Tidak Ada")
            }

            let query: string = `${apiURL}/users/rb/getRBReturnByProduct/${idProduk}/${idPermintaan}?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, idProduk, idPermintaan, limit, offset, params?.status])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPengembalian = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian
    }
}


// ANCHOR - Pengembalian RB - ID Permintaan
export function GetAllNomorReturnRBByIDDetailPermintaan(session: string, idDetailPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
    const [listNomorPengembalian, setListNomorPengembalian] = useState<any>(null);
    const [isLoadingListNomorPengembalian, setIsLoadingListNomorPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListNomorPengembalian(true)
            setError(null)

            if (idDetailPermintaan === null) {
                throw new Error("ID Detail Permintaan Tidak Ada")
            }

            let query: string = `${apiURL}/users/rb/getRBReturnIdPermintaan/${idDetailPermintaan}?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListNomorPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListNomorPengembalian(false)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, idDetailPermintaan, limit, offset, params?.status])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListNomorPengembalian = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listNomorPengembalian, isLoadingListNomorPengembalian, error, mutateListNomorPengembalian
    }
}


//ANCHOR - Pengembalian RB - Admin
export function GetAllReturnRBAdminByProduct(session: string, id: any, limit?: number, offset?: number, params?: { number?: string | null, status?: string, startDate?: string | null, endDate?: string | null }) {
    const [listPengembalian, setListPengembalian] = useState<any>(null);
    const [isLoadingListPengembalian, setIsLoadingListPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPengembalian(true)
            setError(null)

            if (id === null) {
                throw new Error("Pilih Produk Terlebih Dahulu")
            }

            let query: string = `${apiURL}/admin/product_rb/getRBReturnAdminByProduct/${id}?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, id, limit, offset, params?.status, params?.startDate, params?.endDate, params?.number])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPengembalian = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian
    }
}

//ANCHOR - Pengembalian RB - Admin
export function GetAllReturnRBAdminByProductAndIdPermintaan(session: string, idProduk: any, idPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
    const [listPengembalian, setListPengembalian] = useState<any>(null);
    const [isLoadingListPengembalian, setIsLoadingListPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPengembalian(true)
            setError(null)

            if (idProduk === null) {
                throw new Error("Pilih Produk Terlebih Dahulu")
            }

            if (idPermintaan === null) {
                throw new Error("ID Permintaan Tidak Ada")
            }

            let query: string = `${apiURL}/admin/product_rb/getRBReturnAdminByProduct/${idProduk}/${idPermintaan}?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, idProduk, idPermintaan, limit, offset, params?.status])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListPengembalian = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listPengembalian, isLoadingListPengembalian, error, mutateListPengembalian
    }
}


// ANCHOR - Pengembalian RB - ID Permintaan - Admin
export function GetAllNomorReturnRBAdminByIDDetailPermintaan(session: string, idDetailPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
    const [listNomorPengembalian, setListNomorPengembalian] = useState<any>(null);
    const [isLoadingListNomorPengembalian, setIsLoadingListNomorPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListNomorPengembalian(true)
            setError(null)

            if (idDetailPermintaan === null) {
                throw new Error("ID Detail Permintaan Tidak Ada")
            }

            let query: string = `${apiURL}/users/rb/getRBReturnIdPermintaan/${idDetailPermintaan}?`

            if (limit !== undefined && offset !== undefined) {
                query += `limit=${limit}&offset=${offset}&`
            }

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        query += `${key}=${value}&`
                    }
                }
            }

            const response = await axios.get(query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session}`
                }
            });

            setListNomorPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListNomorPengembalian(false)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, idDetailPermintaan, limit, offset, params?.status])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListNomorPengembalian = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listNomorPengembalian, isLoadingListNomorPengembalian, error, mutateListNomorPengembalian
    }
}

//!SECTION

//SECTION - Dashboard API Endpoint
//ANCHOR - Get Dashboard Data Admin
export function GetDashboardDataAdmin(session: string) {
    const [listDashboardData, setListDashboardData] = useState<any>(null);
    const [isLoadingListDashboardData, setIsLoadingListDashboardData] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListDashboardData(true)
            setError(null)

            const dashboardData = await axios.get(apiURL + "/admin/product_rb/generateReportDashboadAdmin", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + session
                }
            })

            setListDashboardData(dashboardData.data)

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListDashboardData(false)
        }
    }, [session])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListDashboardData = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listDashboardData, isLoadingListDashboardData, error, mutateListDashboardData
    }
}

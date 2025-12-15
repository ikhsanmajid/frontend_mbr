"use client"
import { useState, useEffect, useCallback } from "react";
import useSWRImmutable from "swr/immutable";
import api from "@/app/lib/axios";

export const fetcher = ([endpoint, options]: [string, object]) => api.get(endpoint, options).then(res => { return res.data })

//SECTION - User API Endpoint
//ANCHOR - Get Semua Users
export function FetchAllUser(limit?: number, offset?: number, params?: { search_user?: string, active?: string, idBagian?: string | null }) {
    const [listUser, setListUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingUser(true)
            setError(null)

            let query: string = `/admin/users/find-all?`

            const queryParams = new URLSearchParams({

            })

            if (limit) queryParams.append('limit', String(limit))
            if (offset) queryParams.append('offset', String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(query, { params: queryParams, apiVersion: "2" });

            setListUser(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingUser(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.active, params?.search_user, params?.idBagian])

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
export async function deleteUser(deleteData: any) {
    const processDelete = await api.delete(`/admin/users/delete-user/${deleteData.id}`, { apiVersion: "2" })

    return processDelete
}

//ANCHOR - Tambah Bagian Jabatan ke User
export async function addBagianJabatan(data: any) {
    const addProcess = await api.post("/admin/users/add-user-department-employment", {
        "idBagianJabatan": data.idBagianJabatan,
        "idUser": data.idUser
    }, { apiVersion: "2" })
    return addProcess
}

//ANCHOR - Update User
export async function updateDataUser({ data }: { data: { [key: string]: string | number } }) {
    const updateProcess = await api.patch(`/admin/users/update-user/${data.id}`, {
        email: data.email,
        nik: data.nik,
        nama: data.nama,
        password: data.password == "default" ? "" : data.password,
        is_admin: data.isAdmin,
        is_active: data.isActive,
    }, { apiVersion: "2" })

    return updateProcess
}

//ANCHOR - Update User
export async function updateDataUserBagianJabatan(data: { id: string, idBagianJabatan: string }) {
    const updateProcess = await api.patch(`/admin/users/update-user-department-employment`, {
        id: data.id,
        idBagianJabatan: data.idBagianJabatan
    }, { apiVersion: "2" })

    return updateProcess
}

//ANCHOR - Get Detail User by Id
export function GetDetailUserInfo(id: number) {

    const { data: detailUser, isLoading, mutate } = useSWRImmutable(["/admin/users/detail/" + id.toString(), { apiVersion: "2" }], fetcher)

    return {
        detailUser,
        detailUserLoading: isLoading,
        mutateUser: mutate
    }
}

//ANCHOR - Delete Jabatan User By Id
export async function deleteBagianJabatanUser(id: string) {
    const processDelete = await api.delete("/admin/users/delete-user-department-employment/" + id, { apiVersion: "2" })

    return processDelete
}

//ANCHOR - Check Email Exist
export async function checkEmail(email: string) {
    const emailCheck = await api.get("/admin/users/check-email/?email=" + email, { apiVersion: "2" })
    return emailCheck
}


//!SECTION

//SECTION - Bagian API Endpoint
//ANCHOR - Get Semua Bagian Axios
export function useGetAllBagian(onlyManufactur: boolean, limit?: number, offset?: number, params?: { [key: string]: string }) {
    const [detailBagian, setDetailBagian] = useState<any>(null);
    const [isLoadingBagian, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = "/admin/departments/find-all"

            const queryParams = new URLSearchParams({
                manufaktur: onlyManufactur ? "yes" : "no"
            })

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        queryParams.append(key, value)
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setDetailBagian(response.data)
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.search, onlyManufactur]);

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
export async function add_bagian(data: any) {
    const addProcess = await api.post("/admin/departments/add-department", {
        nama_bagian: data.bagian,
        kategori: data.kategori
    }, { apiVersion: "2" })

    return addProcess.data
}

//ANCHOR - Check Bagian by Name
export async function checkBagian(bagian: string) {
    const bagianCheck = await api.get("/admin/departments/check-department/?nama_bagian=" + bagian, { apiVersion: "2" })

    return bagianCheck
}

//ANCHOR - Update Bagian by Id
export async function edit_bagian(id: number | undefined, data: { bagian: string, active: string, kategori: string }) {

    const editProcess = await api.patch("/admin/departments/update-department/" + id, {
        nama_bagian: data.bagian,
        is_active: data.active == "1" ? "true" : "false",
        kategori: data.kategori
    }, { apiVersion: "2" })

    return editProcess.data
}

//ANCHOR - Delete Bagian by Id
export async function deleteBagian(deleteData: any) {
    const processDelete = await api.delete("/admin/departments/delete-department/" + deleteData.id, { apiVersion: "2" })

    return processDelete
}
//!SECTION



//SECTION - Jabatan API Endpoint
//ANCHOR - Get Semua Jabatan Axios
export function useGetAllJabatan(limit?: number, offset?: number) {
    const [detailJabatan, setDetailJabatan] = useState<any>(null);
    const [isLoadingJabatan, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // const query = `?limit=${limit}&offset=${offset}`;
            const endpoint = "/admin/employments/find-all"
            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setDetailJabatan(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [limit, offset]);

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
export async function GetJabatanByIDBagian(id: string) {
    const listJabatan = await api.get("/admin/departments-employments/get-employment-by-department/" + id, { apiVersion: "2" })

    return listJabatan.data
}

//ANCHOR - Update Jabatan by Id
export async function edit_jabatan(id: number | undefined, data: any) {

    const editProcess = await api.patch("/admin/employments/update-employment/" + id, {
        nama_jabatan: data.jabatan,
        is_active: data.active == "1" ? "true" : "false"
    }, { apiVersion: "2" })

    return editProcess.data
}

//ANCHOR - Check Bagian by Name
export async function checkJabatan(jabatan: string) {
    const jabatanCheck = await api.get("/admin/employments/check-employment/?nama_jabatan=" + jabatan, { apiVersion: "2" })

    return jabatanCheck
}

//ANCHOR - Delete Jabatan by Id
export async function deleteJabatan(deleteData: any) {
    const processDelete = await api.delete("/admin/employments/delete-employment/" + deleteData.id, { apiVersion: "2" })

    return processDelete
}
//!SECTION


//SECTION - Bagian vs Jabatan API Endpoint
//ANCHOR - Get All Bagian vs Jabatan Axios
export function useGetAllBagianJabatan(limit?: number, offset?: number, sort?: "asc" | "desc", params?: { bagian?: string }) {
    const [detailBagianJabatan, setDetailBagianJabatan] = useState<any>(null);
    const [isLoadingBagianJabatan, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = "/admin/departments-employments/find-all"
            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))
            if (sort) queryParams.append("sort", sort)

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        queryParams.append(key, value)
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setDetailBagianJabatan(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, sort, params?.bagian]);

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
export async function add_bagian_jabatan(data: any) {
    const addProcess = await api.post("/admin/departments-employments/add-department-employment", {
        id_bagian: data.bagian,
        id_jabatan: data.jabatan
    }, { apiVersion: "2" })

    return addProcess.data
}

//ANCHOR - Update Bagian by Id
export async function edit_bagian_jabatan(id: number | undefined, data: any) {

    const editProcess = await api.patch("/admin/departments-employments/update-department-employment/" + id, {
        id_bagian: data.bagian,
        id_jabatan: data.jabatan
    }, { apiVersion: "2" })

    return editProcess.data
}

//ANCHOR - Check Bagian by ID
export async function checkBagianJabatan(bagian: string, jabatan: string) {

    const queryParams = new URLSearchParams({})

    if (bagian) queryParams.append("id_bagian", bagian)
    if (jabatan) queryParams.append("id_jabatan", jabatan)

    const bagianJabatanCheck = await api.get("/admin/departments-employments/check-department-employment/", {
        params: queryParams,
        apiVersion: "2"
    })

    return bagianJabatanCheck
}

//ANCHOR - Delete Bagian Jabatan by Id
export async function deleteBagianJabatan(deleteData: any) {
    const processDelete = await api.delete("/admin/departments-employments/delete-department-employment/" + deleteData.id,
        { apiVersion: "2" })

    return processDelete
}


//!SECTION

//SECTION - User API Endpoint
//ANCHOR - Get Semua Produk
export function FetchAllProduk(limit?: number, offset?: number, params?: { nama_produk?: string, id_bagian?: string, status?: string }, shouldFetch: boolean = true) {
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

            let endpoint = `/admin/product/get-product`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        queryParams.append(key, value)
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setListProduk(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListProduk(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.id_bagian, params?.nama_produk, params?.status])

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
export async function deleteProduk(deleteData: any) {
    const processDelete = await api.delete("/admin/product/delete-product/" + deleteData.id,
        { apiVersion: "2" })

    return processDelete
}

//ANCHOR - Edit Produk
export async function edit_produk(id: number | undefined, data: any) {
    const editProcess = await api.put("/admin/product/update-product/" + id, {
        nama_produk: data.nama_produk,
        id_bagian: data.id_bagian,
        id_kategori: data.id_kategori,
        is_active: data.active
    }, { apiVersion: "2" })

    return editProcess.data
}
//!SECTION


//SECTION - Flow Permintaan RB
//ANCHOR - Tambah Permintaan RB
export async function addPermintaanNomor(data: any) {
    const addProcess = await api.post("/users/rb/addRequestRB", {
        data: data
    });

    return addProcess.data;
}

//ANCHOR - Edit Permintaan RB
export async function editPermintaanNomor(oldid: number, data: any) {
    const addProcess = await api.post("/users/rb/editRequestRB", {
        data: data,
        oldid: oldid
    });

    return addProcess.data;
}

//ANCHOR - Mark Sudah Dipakai Permintaan RB
export async function usedPermintaanNomor(id: number) {
    const addProcess = await api.put(`/users/rb/usedRequestRB/${id}`);

    return addProcess.data;
}

//ANCHOR - Get Permintaan RB User
export function GetPermintaanRB(limit?: number, offset?: number, params?: { status?: string, used?: string | boolean, keyword?: string | null, idProduk?: number | null, year: number | null, id: number | null }, sort?: { field?: string, order?: string }) {
    const [listPermintaan, setListPermintaan] = useState<any>(null);
    const [isLoadingListPermintaan, setIsLoadingListPermintaan] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPermintaan(true)
            setError(null)

            const endpoint = `/users/rb/listRequestRB`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            if (sort !== undefined) {
                for (const [key, value] of Object.entries(sort)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams
            })

            setListPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.status, params?.used, params?.keyword, params?.idProduk, params?.year, params?.id, sort?.field, sort?.order])

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
export function GetPermintaanRBAdmin(limit?: number, offset?: number, params?: { status?: string, used?: string | boolean, keyword?: string | null, idProduk?: number | null, idBagian?: number | null, year?: number | null, id: number | null }, sort?: { field?: string, order?: string }) {
    const [listPermintaan, setListPermintaan] = useState<any>(null);
    const [isLoadingListPermintaan, setIsLoadingListPermintaan] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPermintaan(true)
            setError(null)

            const endpoint = `/admin/mbr/request/list-requests`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            if (sort !== undefined) {
                for (const [key, value] of Object.entries(sort)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setListPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.status, params?.used, params?.keyword, params?.idProduk, params?.idBagian, params?.year, params?.id, sort?.field, sort?.order])

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

export async function deleteTransaksi(data: any) {
    const deleteProcess = await api.delete(`/admin/mbr/request/delete-request/${data.id}`, {
        apiVersion: "2"
    });

    return deleteProcess;
}

//ANCHOR - Get List Detail Permintaan By ID
export function GetDetailPermintaan(id: number | null) {
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

            let query: string = `/admin/mbr/request/list-detail-request?id=${id}`

            const response = await api.get(query, { apiVersion: "2" });

            setDetailPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

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
export function GetDetailPermintaanNomor(id: number | null) {
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

            let query: string = `/admin/mbr/request/list-number-order-by-id-request?id=${id}`

            const response = await api.get(query, { apiVersion: "2" });

            setDetailPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

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
export async function confirmPermintaan(data: any, action: "confirm" | "reject", reason?: string) {
    const confirmProcess = await api.post("/admin/mbr/request/confirm-request/" + data.id, {
        action: action,
        reason: reason
    }, { apiVersion: "2" })

    return confirmProcess
}
//!SECTION

//SECTION - Kategori API Endpoint
//ANCHOR - Get Semua Kategori
export function FetchAllKategori(limit?: number, offset?: number, params?: { search_kategori?: string }) {
    const [detailKategori, setDetailKategori] = useState<any>(null);
    const [isLoadingKategori, setIsLoadingKategori] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingKategori(true)
            setError(null)

            const endpoint = `/admin/category/get-category`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setDetailKategori(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingKategori(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.search_kategori])

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
export async function checkCategory(kategori: string) {
    const bagianCheck = await api.get("/admin/category/check-category/?nama_kategori=" + kategori,
        { apiVersion: "2" }
    )

    return bagianCheck
}

//ANCHOR - Update Kategori by Id
export async function edit_kategori(id: string | number | undefined, data: any) {

    const editProcess = await api.patch("/admin/category/update-category/" + id, {
        nama_kategori: data.namaKategori,
        starting_number: data.startingNumber,
    }, { apiVersion: "2" })

    return editProcess.data
}

//ANCHOR - Delete Kategori by Id
export async function deleteCategory(deleteData: any) {
    const processDelete = await api.delete("/admin/category/delete-category/" + deleteData.id,
        { apiVersion: "2" })

    return processDelete.data
}

//ANCHOR - Tambah Bagian
export async function add_kategori(data: any) {
    const addProcess = await api.post("/admin/category/add-category", {
        nama_kategori: data.namaKategori,
        starting_number: data.startingNumber
    }, { apiVersion: "2" })

    return addProcess.data
}

//ANCHOR - Pengembalian RB
export function GetAllReturnRBByProduct(id: any, limit?: number, offset?: number, params?: { number?: string | null, status?: string, startDate?: string | null, endDate?: string | null }) {
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

            const endpoint = `/users/rb/getRBReturnByProduct/${id}`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams
            })

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, limit, offset, params?.status, params?.startDate, params?.endDate, params?.number])

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
export function GetAllReturnRBByProductAndIdPermintaan(idProduk: any, idPermintaan: any, group_id: any, limit?: number, offset?: number, params?: { status?: string | null }) {
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

            const endpoint = `/users/rb/getRBReturnByProduct/${idProduk}/${idPermintaan}/${group_id}`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams
            })

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idProduk, idPermintaan, limit, offset, params?.status])

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


//ANCHOR - Get Audit Trails
export function GetAuditTrailsNomorMBR(id: number | null) {
    const [listAuditTrails, setListAuditTrails] = useState<any>(null);
    const [isLoadingListAuditTrails, setIsLoadingListAuditTrails] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListAuditTrails(true)
            setError(null)

            if (id === null) {
                throw new Error("ID Tidak Ada")
            }

            const endpoint = `/users/mbr/audit/nomor-mbr-audit-trails`

            const queryParams = new URLSearchParams({})

            if (id) queryParams.append("id", String(id))

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setListAuditTrails(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListAuditTrails(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const mutateListAuditTrails = useCallback(() => {
        fetchData()
    }, [fetchData])

    return {
        listAuditTrails, isLoadingListAuditTrails, error, mutateListAuditTrails
    }
}


// ANCHOR - Pengembalian RB - ID Permintaan
export function GetAllNomorReturnRBByIDDetailPermintaan(idDetailPermintaan: any, limit?: number, offset?: number, params?: { status?: string, searchNumber?: string }) {
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

            const endpoint = `/users/rb/getRBReturnIdPermintaan/${idDetailPermintaan}`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams
            })

            setListNomorPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListNomorPengembalian(false)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idDetailPermintaan, limit, offset, params?.status, params?.searchNumber])

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
export function GetAllReturnRBAdminByProduct(id: any, limit?: number, offset?: number, params?: { number?: string | null, status?: string, startDate?: string | null, endDate?: string | null, idBagian?: number | null }) {
    const [listPengembalian, setListPengembalian] = useState<any>(null);
    const [isLoadingListPengembalian, setIsLoadingListPengembalian] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPengembalian(true)
            setError(null)

            if (id === null && params?.status !== "outstanding" && params?.idBagian === null) {
                throw new Error("Pilih Produk Terlebih Dahulu")
            }

            let endpoint = `/admin/mbr/return/get-returned-admin-by-product/`

            if (params?.status === "outstanding" && params?.idBagian !== null && id === null) {
                endpoint = `/admin/mbr/return/get-returned-admin-by-department`
            } else if (params?.status === "outstanding" && params?.idBagian === null) {
                endpoint = `/admin/mbr/return/get-returned-admin-by-status-outstanding`
            } else {
                endpoint += `${id}`
            }

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, limit, offset, params?.status, params?.startDate, params?.endDate, params?.number, params?.idBagian])

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
export function GetAllReturnRBAdminByProductAndIdPermintaan(idProduk: any, idPermintaan: any, group_id: any, limit?: number, offset?: number, params?: { status?: string }) {
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

            const endpoint = `/admin/mbr/return/get-returned-admin-by-product/${idProduk}/${idPermintaan}/${group_id}`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams,
                apiVersion: "2"
            })

            setListPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPengembalian(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idProduk, idPermintaan, limit, offset, params?.status])

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
export function GetAllNomorReturnRBAdminByIDDetailPermintaan(idDetailPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
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

            const endpoint = `/users/rb/getRBReturnIdPermintaan/${idDetailPermintaan}`

            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "" && value != null) {
                        queryParams.append(key, String(value))
                    }
                }
            }

            const response = await api.get(endpoint, {
                params: queryParams
            })

            setListNomorPengembalian(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListNomorPengembalian(false)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idDetailPermintaan, limit, offset, params?.status])

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
export function GetDashboardDataAdmin() {
    const [listDashboardData, setListDashboardData] = useState<any>(null);
    const [isLoadingListDashboardData, setIsLoadingListDashboardData] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListDashboardData(true)
            setError(null)

            const dashboardData = await api.get("/admin/report/generate-report-dashboard-admin", {
                apiVersion: "2"
            })

            setListDashboardData(dashboardData.data)

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListDashboardData(false)
        }
    }, [])

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

//ANCHOR - Get Dashboard Data Admin
export function GetDashboardDataUser() {
    const [listDashboardData, setListDashboardData] = useState<any>(null);
    const [isLoadingListDashboardData, setIsLoadingListDashboardData] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListDashboardData(true)
            setError(null)

            const dashboardData = await api.get("/users/rb/generateReportDashboadUser/")

            setListDashboardData(dashboardData.data)

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListDashboardData(false)
        }
    }, [])

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

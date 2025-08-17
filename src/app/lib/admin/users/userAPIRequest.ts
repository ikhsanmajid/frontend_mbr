"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useSWRImmutable from "swr/immutable";
import api from "../../axios";

export const fetcher = ([endpoint, options]: [string, object]) => api.get(endpoint, options).then(res => { return res.data })

//SECTION - User API Endpoint
//ANCHOR - Get Semua Users
export function FetchAllUser(limit?: number, offset?: number, params?: { search_user?: string, active?: string }) {
    const [listUser, setListUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingUser(true)
            setError(null)

            let query: string = `/admin/users/findAll?`

            const queryParams = new URLSearchParams({

            })

            if (limit) queryParams.append('limit', String(limit))
            if (offset) queryParams.append('offset', String(offset))

            if (params !== undefined) {
                for (const [key, value] of Object.entries(params)) {
                    if (value != "") {
                        queryParams.append(key, value)
                    }
                }
            }

            const response = await api.get(query, { params: queryParams });

            setListUser(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingUser(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.active, params?.search_user])

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
    const processDelete = await api.delete(`/admin/users/deleteUser/${deleteData.id}`)

    return processDelete
}

//ANCHOR - Tambah Bagian Jabatan ke User
export async function addBagianJabatan(data: any) {
    const addProcess = await api.post("/admin/users/addUserJabatan", {
        "idBagianJabatan": data.idBagianJabatan,
        "idUser": data.idUser
    })
    return addProcess
}

//ANCHOR - Update User
export async function updateDataUser({ data }: { data: { [key: string]: string | number } }) {
    const updateProcess = await api.patch(`/admin/users/updateUser/${data.id}`, {
        email: data.email,
        nik: data.nik,
        nama: data.nama,
        password: data.password == "default" ? "" : data.password,
        is_admin: data.isAdmin,
        is_active: data.isActive,
    })

    return updateProcess
}

//ANCHOR - Update User
export async function updateDataUserBagianJabatan(data: { id: string, idBagianJabatan: string }) {
    const updateProcess = await api.patch(`/admin/users/updateUserJabatan`, {
        id: data.id,
        idBagianJabatan: data.idBagianJabatan
    })

    return updateProcess
}

//ANCHOR - Get Detail User by Id
export function GetDetailUserInfo(id: number) {

    const { data: detailUser, isLoading, mutate } = useSWRImmutable(["/admin/users/detail/" + id.toString(), {}], fetcher)

    return {
        detailUser,
        detailUserLoading: isLoading,
        mutateUser: mutate
    }
}

//ANCHOR - Delete Jabatan User By Id
export async function deleteBagianJabatanUser(id: string) {
    const processDelete = await api.delete("/admin/users/deleteJabatan/" + id)

    return processDelete
}

//ANCHOR - Check Email Exist
export async function checkEmail(email: string) {
    const emailCheck = await api.get("/admin/users/checkEmail/?email=" + email)
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
            const endpoint = "/admin/department/findAll"

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
                params: queryParams
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
    const addProcess = await api.post("/admin/department/addDepartment", {
        nama_bagian: data.bagian,
        kategori: data.kategori
    })

    return addProcess.data
}

//ANCHOR - Check Bagian by Name
export async function checkBagian(bagian: string) {
    const bagianCheck = await api.get("/admin/department/findFixedDepartment/?nama_bagian=" + bagian)

    return bagianCheck
}

//ANCHOR - Update Bagian by Id
export async function edit_bagian(id: number | undefined, data: { bagian: string, active: string, kategori: string }) {

    const editProcess = await api.patch("/admin/department/updateDepartment/" + id, {
        nama_bagian: data.bagian,
        is_active: data.active == "1" ? "true" : "false",
        kategori: data.kategori
    })

    return editProcess.data
}

//ANCHOR - Delete Bagian by Id
export async function deleteBagian(deleteData: any) {
    const processDelete = await api.delete("/admin/department/deleteDepartment/" + deleteData.id)

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
            const endpoint = "/admin/employment/findAll"
            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))

            const response = await api.get(endpoint, {
                params: queryParams
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
    const listJabatan = await api.get("/admin/department_employment/findJabatan/" + id)

    return listJabatan.data
}

//ANCHOR - Update Jabatan by Id
export async function edit_jabatan(id: number | undefined, data: any) {

    const editProcess = await api.patch("/admin/employment/updateEmployment/" + id, {
        nama_jabatan: data.jabatan,
        is_active: data.active == "1" ? "true" : "false"
    })

    return editProcess.data
}

//ANCHOR - Check Bagian by Name
export async function checkJabatan(jabatan: string) {
    const jabatanCheck = await api.get("/admin/employment/findFixedEmployment/?nama_jabatan=" + jabatan)

    return jabatanCheck
}

//ANCHOR - Delete Jabatan by Id
export async function deleteJabatan(deleteData: any) {
    const processDelete = await api.delete("/admin/employment/deleteEmployment/" + deleteData.id)

    return processDelete
}
//!SECTION


//SECTION - Bagian vs Jabatan API Endpoint
//ANCHOR - Get All Bagian vs Jabatan Axios
export function useGetAllBagianJabatan(limit?: number, offset?: number, sort?: "asc" | "desc") {
    const [detailBagianJabatan, setDetailBagianJabatan] = useState<any>(null);
    const [isLoadingBagianJabatan, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = "/admin/department_employment/findAll"
            const queryParams = new URLSearchParams({})

            if (limit) queryParams.append("limit", String(limit))
            if (offset) queryParams.append("offset", String(offset))
            if (sort) queryParams.append("sort", sort)

            const response = await api.get(endpoint, {
                params: queryParams
            })

            setDetailBagianJabatan(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [limit, offset, sort]);

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
    const addProcess = await api.post("/admin/department_employment/addDepartmentEmployment", {
        id_bagian: data.bagian,
        id_jabatan: data.jabatan
    })

    return addProcess.data
}

//ANCHOR - Update Bagian by Id
export async function edit_bagian_jabatan(id: number | undefined, data: any) {

    const editProcess = await api.patch("/admin/department_employment/updateDepartmentEmployment/" + id, {
        id_bagian: data.bagian,
        id_jabatan: data.jabatan
    })

    return editProcess.data
}

//ANCHOR - Check Bagian by ID
export async function checkBagianJabatan(bagian: string, jabatan: string) {

    const queryParams = new URLSearchParams({})

    if (bagian) queryParams.append("id_bagian", bagian)
    if (jabatan) queryParams.append("id_jabatan", jabatan)

    const bagianJabatanCheck = await api.get("/admin/department_employment/findFixedDepartmentEmployment/", {
        params: queryParams
    })

    return bagianJabatanCheck
}

//ANCHOR - Delete Bagian Jabatan by Id
export async function deleteBagianJabatan(deleteData: any) {
    const processDelete = await api.delete("/admin/department_employment/deleteDepartmentEmployment/" + deleteData.id)

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

            let endpoint = `/admin/product/getProduct`

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
                params: queryParams
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
    const processDelete = await api.delete("/admin/product/deleteProduct/" + deleteData.id)

    return processDelete
}

//ANCHOR - Edit Produk
export async function edit_produk(id: number | undefined, data: any) {
    const editProcess = await api.put("/admin/product/editProduct/" + id, {
        nama_produk: data.nama_produk,
        id_bagian: data.id_bagian,
        id_kategori: data.id_kategori,
        is_active: data.active
    })

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
export function GetPermintaanRB(limit?: number, offset?: number, params?: { status?: string, used?: string | boolean, keyword?: string | null, idProduk?: number | null, year: number | null }) {
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
    }, [limit, offset, params?.status, params?.used, params?.keyword, params?.idProduk, params?.year])

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
export function GetPermintaanRBAdmin(limit?: number, offset?: number, params?: { status?: string, used?: string | boolean, keyword?: string | null, idProduk?: number | null, idBagian?: number | null, year?: number | null }) {
    const [listPermintaan, setListPermintaan] = useState<any>(null);
    const [isLoadingListPermintaan, setIsLoadingListPermintaan] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoadingListPermintaan(true)
            setError(null)

            const endpoint = `/admin/product_rb/listPermintaan`

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

            setListPermintaan(response.data);

        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingListPermintaan(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, offset, params?.status, params?.used, params?.keyword, params?.idProduk, params?.idBagian, params?.year])

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

            let query: string = `/admin/product_rb/listDetailPermintaan?id=${id}`

            const response = await api.get(query);

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

            let query: string = `/admin/product_rb/listNomorUrutByIdPermintaan?id=${id}`

            const response = await api.get(query);

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
    const confirmProcess = await api.post("/admin/product_rb/confirmPermintaan/" + data.id, {
        action: action,
        reason: reason
    })

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

            const endpoint = `/admin/product/getKategori`

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
    const bagianCheck = await api.get("/admin/product/checkKategori/?nama_kategori=" + kategori)

    return bagianCheck
}

//ANCHOR - Update Kategori by Id
export async function edit_kategori(id: string | number | undefined, data: any) {

    const editProcess = await api.patch("/admin/product/updateCategory/" + id, {
        nama_kategori: data.namaKategori,
        starting_number: data.startingNumber,
    })

    return editProcess.data
}

//ANCHOR - Delete Kategori by Id
export async function deleteCategory(deleteData: any) {
    const processDelete = await api.delete("/admin/product/deleteCategory/" + deleteData.id)

    return processDelete
}

//ANCHOR - Tambah Bagian
export async function add_kategori(data: any) {
    const addProcess = await api.post("/admin/product/addCategory", {
        nama_kategori: data.namaKategori,
        starting_number: data.startingNumber
    })

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
export function GetAllReturnRBByProductAndIdPermintaan(idProduk: any, idPermintaan: any, limit?: number, offset?: number, params?: { status?: string | null }) {
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

            const endpoint = `/users/rb/getRBReturnByProduct/${idProduk}/${idPermintaan}`

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


// ANCHOR - Pengembalian RB - ID Permintaan
export function GetAllNomorReturnRBByIDDetailPermintaan(idDetailPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
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

            let endpoint = `/admin/product_rb/getRBReturnAdminByProduct/`

            if (params?.status === "outstanding" && params?.idBagian !== null && id === null) {
                endpoint = `/admin/product_rb/getRBReturnAdminByBagian?`
            } else if (params?.status === "outstanding" && params?.idBagian === null) {
                endpoint = `/admin/product_rb/getRBReturnAdminByStatusOutstanding?`
            } else {
                endpoint += `${id}?`
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
                params: queryParams
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
export function GetAllReturnRBAdminByProductAndIdPermintaan(idProduk: any, idPermintaan: any, limit?: number, offset?: number, params?: { status?: string }) {
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

            const endpoint = `/admin/product_rb/getRBReturnAdminByProduct/${idProduk}/${idPermintaan}`

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

            const dashboardData = await api.get("/admin/product_rb/generateReportDashboadAdmin")

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

"use client"
import { apiURL } from "../lib/admin/users/userAPIRequest"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ServerOffline() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dest = searchParams.get("dest") as string
    const handleRedirect = async () => {
        try {
            const response = await fetch(apiURL)
            if (response.ok) {
                router.push(dest)
            }
        } catch (e) {
            return (
                <></>
            )
        }
    }

    useEffect(() => {
        handleRedirect()
        //eslint-disable-next-line
    }, [dest])

    return (
        <div className="h-100 v-100">
            <div className="d-flex justify-content-center pt-4">
                <h1>Oops.. Server Offline!</h1>
            </div>
        </div>
    )

}
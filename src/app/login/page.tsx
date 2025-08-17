"use client"
import { FormEvent, useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from "next/navigation"
import LoginForm from "./LoginForm"

export default function LoginPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const expired = searchParams.get("expired")
    const nextPath = searchParams.get("next") || ""
    const host = process.env.NEXT_PUBLIC_ABSOLUTE_URL! as string

    const [isLoading, setIsLoading] = useState<boolean>(false)

    function topCenterToastError(message: string | undefined){
        toast.error(message, {
            position: "top-center",
            autoClose: 1500,
            theme: "colored"
        })
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const logIn = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })

        if (logIn.error) {
            setIsLoading(false)
            if (logIn.code == "Empty Field") topCenterToastError("Username atau Password kosong")
            else topCenterToastError(logIn.code)
        } else if (logIn?.ok) {
            setIsLoading(false)
            if (nextPath.length > 0) {
                router.refresh()
                router.push(`${host}/${nextPath}`)
            } else {
                router.refresh()
                router.push("/")
            }
        }
    }

    useEffect(() => {
        if (expired) {
            topCenterToastError("Session Telah Berakhir. Login Kembali")
        }
    }, [expired])

    return (
        <>
            <div style={{ height: "90vh" }} className="w-100 d-flex justify-content-center align-items-center">
                <LoginForm handleSubmit={(e: any) => handleSubmit(e)} isLoading={isLoading}></LoginForm>
            </div>
        </>

    )
}
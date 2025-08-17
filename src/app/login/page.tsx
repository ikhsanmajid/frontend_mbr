"use client"
import { FormEvent, useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import LoginForm from "./LoginForm"
import { ToastContainer, toast } from 'react-toastify'
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const expired = searchParams.get("expired")
    const nextPath = searchParams.get("next") || ""
    const host = process.env.NEXT_PUBLIC_ABSOLUTE_URL! as string

    const [isLoading, setIsLoading] = useState<boolean>(false)

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
            if (logIn.code == "Empty Field") toast.error("Username atau Password kosong")
            else toast.error(logIn.code)
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
            toast.error("Session Telah Berakhir. Login Kembali")
        }
    }, [expired])

    return (
        <>
            <div style={{ height: "90vh" }} className="w-100 d-flex justify-content-center align-items-center">
                <LoginForm handleSubmit={(e: any) => handleSubmit(e)} isLoading={isLoading}></LoginForm>
                <ToastContainer position="top-center" autoClose={2000} theme="colored" pauseOnHover={false} />
            </div>
        </>

    )
}
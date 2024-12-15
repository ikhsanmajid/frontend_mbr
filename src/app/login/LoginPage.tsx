"use client"
import { FormEvent, useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import LoginForm from "./LoginForm"
import { toast, Toaster } from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Toast, ToastContainer } from "react-bootstrap"

export default function LoginPage() {
    const searchParams = useSearchParams()
    const [show, setShow] = useState<boolean>(true)

    const router = useRouter()
    const expired = searchParams.get("expired")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);
        const email = await formData.get("email") as string;
        const password = await formData.get("password") as string;

        const logIn = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })

        if (logIn?.error) {
            setIsLoading(false)
            toast.error(logIn?.error)
        }

        if (logIn?.ok) {
            setIsLoading(false)
            router.push("/")
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
                <Toaster />
            </div>
        </>

    )
}
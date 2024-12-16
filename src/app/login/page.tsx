import { getServerSession } from "next-auth"
import LoginPage from "./LoginPage"
import { authOptions } from "../option"
import { redirect } from "next/navigation"

export default async function Login() {
    const session = await getServerSession(authOptions)
    if (session){
        redirect("/")
    }

    return (
        <LoginPage></LoginPage>
    )
}
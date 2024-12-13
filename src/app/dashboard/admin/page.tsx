import { getServerSession } from "next-auth"
import { authOptions } from "@/app/option"
import { redirect } from "next/navigation"

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true || !session) redirect("/")

    return (
        <>
            <p>Halaman dashboard</p>
        </>
    )
}
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/option"
import { redirect } from "next/navigation"

export default async function Users() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin === true || !session) redirect("/")

    return (
        <div>
            Halaman Users
        </div>
    )
}
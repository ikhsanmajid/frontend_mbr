import { authOptions } from "@/app/option"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react";
import ListPengembalianUser from "./List"

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true || session === null) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListPengembalianUser session={access_token} />
        </Suspense>
    )
}
import { auth } from "@/app/auth";
import { redirect } from "next/navigation"
import { Suspense } from "react";
import ListPengembalianUser from "./List"

export default async function Page() {
    const session = await auth()
    if (session?.user?.is_admin !== true || session === null) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListPengembalianUser session={access_token} />
        </Suspense>
    )
}
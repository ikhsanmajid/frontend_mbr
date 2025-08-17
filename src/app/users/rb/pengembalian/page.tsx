import { auth } from "@/app/auth";
import { redirect } from "next/navigation"
import { Suspense } from "react";
import ListPengembalianUser from "./List"

export default async function Page() {
    const session = await auth()
    if (session?.user?.is_admin === true || session == null) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListPengembalianUser />
        </Suspense>
    )
}
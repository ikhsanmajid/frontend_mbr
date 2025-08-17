import { auth } from "@/app/auth";
import { redirect } from "next/navigation"
import { Suspense } from "react";
import AddPermintaanRB from "../add/Add";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth()
    if (session?.user?.is_admin === true || session == null)  redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <AddPermintaanRB></AddPermintaanRB>
        </Suspense>
    )
}
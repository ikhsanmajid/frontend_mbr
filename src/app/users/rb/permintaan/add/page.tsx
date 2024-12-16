import { authOptions } from "@/app/option"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react";
import AddPermintaanRB from "../add/Add";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin === true || session == null)  redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <AddPermintaanRB session={access_token}></AddPermintaanRB>
        </Suspense>
    )
}
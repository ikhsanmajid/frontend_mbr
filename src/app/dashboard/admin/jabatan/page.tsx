import { authOptions } from "@/app/option";
import { getServerSession } from "next-auth";
import { ListJabatan } from "./ListJabatan"
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Jabatan() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListJabatan session={access_token}></ListJabatan>
        </Suspense>
    )
}
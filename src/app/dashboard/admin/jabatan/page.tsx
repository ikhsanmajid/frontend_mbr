import { auth } from "@/app/auth";
import { ListJabatan } from "./ListJabatan"
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Jabatan() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListJabatan></ListJabatan>
        </Suspense>
    )
}
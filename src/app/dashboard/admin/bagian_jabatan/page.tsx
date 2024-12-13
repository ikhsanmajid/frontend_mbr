import { authOptions } from "@/app/option";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ListBagianJabatan } from "./ListBagianJabatan";

export default async function BagianJabatan() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListBagianJabatan session={access_token}></ListBagianJabatan>
        </Suspense>
    )
}
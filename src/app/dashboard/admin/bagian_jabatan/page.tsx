import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ListBagianJabatan } from "./ListBagianJabatan";

export default async function BagianJabatan() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListBagianJabatan ></ListBagianJabatan>
        </Suspense>
    )
}
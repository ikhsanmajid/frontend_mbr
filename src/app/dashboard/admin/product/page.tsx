import { authOptions } from "@/app/option";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ListProduct from "@/app/dashboard/admin/product/ListProduct";

export default async function Product() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListProduct session={access_token}></ListProduct>
        </Suspense>
    )
}
import { authOptions } from "@/app/option";
import { getServerSession } from "next-auth";
import ListBagian from "./ListBagian"
import { redirect } from "next/navigation";
import { Suspense } from "react";
import React from "react";

export default async function Bagian() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListBagian session={access_token}></ListBagian>
        </Suspense>
    )
}
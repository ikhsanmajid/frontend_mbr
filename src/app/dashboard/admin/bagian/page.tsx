import { auth } from "@/app/auth";
import ListBagian from "./ListBagian"
import { redirect } from "next/navigation";
import { Suspense } from "react";
import React from "react";

export default async function Bagian() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListBagian></ListBagian>
        </Suspense>
    )
}
import { auth } from "@/app/auth";
import ListCategory from "./ListCategory";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import React from "react";

export default async function Bagian() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListCategory></ListCategory>
        </Suspense>
    )
}
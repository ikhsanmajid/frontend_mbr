import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DownloadRB from "./Download";

export default async function Product() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <DownloadRB></DownloadRB>
        </Suspense>
    )
}
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DownloadRB from "./ViewReport";

export default async function Product() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <DownloadRB session={ access_token }></DownloadRB>
        </Suspense>
    )
}
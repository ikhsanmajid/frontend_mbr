import { auth } from "@/app/auth";
import { redirect } from "next/navigation"
import { Suspense } from "react";
import Dashboard from "./Dashboard";

export default async function Index() {
    const session = await auth()
    if (session?.user?.is_admin === true || !session) redirect("/")

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Dashboard></Dashboard>
        </Suspense>
    )
}
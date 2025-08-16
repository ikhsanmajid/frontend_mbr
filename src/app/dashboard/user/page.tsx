import { auth } from "@/app/auth";
import { redirect } from "next/navigation"
import { Suspense } from "react";
import Dashboard from "./Dashboard";

export default async function Index() {
    const session = await auth()
    if (session?.user?.is_admin === true || !session) redirect("/")

    const access_token = session.user!.access_token as string

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Dashboard session={access_token}></Dashboard>
        </Suspense>
    )
}
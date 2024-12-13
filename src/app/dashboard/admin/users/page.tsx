import ListUsers from "./ListUsers"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/option";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function Users() {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin !== true) redirect("/")

    const access_token = session?.user?.access_token as string



    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ListUsers session={access_token}></ListUsers>
        </Suspense>
    )
}
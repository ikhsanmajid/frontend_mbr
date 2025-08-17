import ListUsers from "./ListUsers"
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function Users() {
    const session = await auth()
    if (session?.user?.is_admin !== true) redirect("/")

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ListUsers ></ListUsers>
        </Suspense>
    )
}
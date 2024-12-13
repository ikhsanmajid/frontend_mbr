import { authOptions } from "@/app/option"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react";
import Home from "./Home";

export default async function UserProfile({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (session?.user?.is_admin === true) redirect("/")

    const access_token = session?.user?.access_token as string

    return (
        <Suspense fallback={<>Loading...</>}>
            <Home session={access_token}></Home>
        </Suspense>
    )
}
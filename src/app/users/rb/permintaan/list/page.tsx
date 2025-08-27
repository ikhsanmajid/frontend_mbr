import { auth } from "@/app/auth";
import { redirect } from "next/navigation"
import { Suspense } from "react";
import ListMBR from "./List";

export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
    const session = await auth()
    
    // If admin tries to access user page
    if (session?.user?.is_admin === true) {
        // If there's an ID parameter, redirect to admin page with the same ID
        if (searchParams.id) {
            redirect(`/dashboard/admin/transaction/permintaan?id=${searchParams.id}`)
        } else {
            // Otherwise, redirect to homepage
            redirect("/")
        }
    }
    
    // If no session, redirect to homepage
    if (session == null) redirect("/")

    return (
        <Suspense fallback={<>Loading...</>}>
            <ListMBR></ListMBR>
        </Suspense>
    )
}
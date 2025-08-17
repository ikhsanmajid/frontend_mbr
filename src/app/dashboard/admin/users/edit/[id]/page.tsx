import { EditUser } from "./editPage";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function EditPage({ params }: { params: { id: any } }) {
    const session = await auth()
    if (session?.user?.is_admin == false || !session) redirect("/")

    return (

        <Suspense fallback={<p>Loading...</p>}>
            <EditUser id={params.id}></EditUser>
        </Suspense>

    )
}
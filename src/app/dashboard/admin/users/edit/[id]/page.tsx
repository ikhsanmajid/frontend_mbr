import { EditUser } from "./editPage";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function EditPage({ params }: { params: { id: any } }) {
    const session = await auth()
    if (!session) return redirect("/login")
    if (session?.user?.is_admin == false) redirect("/")

    const access_token = session?.user?.access_token as string



    return (

        <Suspense fallback={<p>Loading...</p>}>
            <EditUser id={params.id} session={access_token}></EditUser>
        </Suspense>

    )
}
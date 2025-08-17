import { auth } from "@/app/auth";
import { AlertNotification } from "@/app/component/alert/alert"
import Profile  from "./Profile";
import { redirect } from "next/navigation"

export default async function UserProfile({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) redirect("/login")
    if (parseInt(params.id) != session.user?.id) return (<AlertNotification variant="danger" heading="Not Allowed" body="Halaman Ini Tidak Bisa Diakses!"></AlertNotification>)

    return (
        <Profile userInfo={session.user}></Profile>
    )
}
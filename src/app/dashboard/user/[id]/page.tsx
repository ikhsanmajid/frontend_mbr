import { authOptions } from "@/app/option"
import { AlertNotification } from "@/app/component/alert/alert"
import Profile  from "./Profile";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function UserProfile({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")
    if (parseInt(params.id) != session.user?.id) return (<AlertNotification variant="danger" heading="Not Allowed" body="Halaman Ini Tidak Bisa Diakses!"></AlertNotification>)
    const access_token = session.user?.access_token as string

    return (
        <Profile userInfo={session.user} session={access_token}></Profile>
    )
}
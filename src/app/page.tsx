import { auth } from "./auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session == null) {
    redirect(`/login?next=${encodeURIComponent("/")}`)
  } else {
    if (session.user?.is_admin == true) {
      redirect("/dashboard/admin/")
    } else if (session?.user?.is_admin == false) {
      redirect("/dashboard/user/")
    } else {
      redirect("/login")
    }
  }
}

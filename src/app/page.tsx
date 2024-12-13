import { getServerSession } from "next-auth";
import { authOptions } from "./option";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user?.is_admin == true){
    redirect("/dashboard/admin/")
  } else if (session?.user?.is_admin == false){
    redirect("/dashboard/user/")
  } else {
    redirect("/login")
  }
}

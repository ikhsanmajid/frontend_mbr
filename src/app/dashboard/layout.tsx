import { Suspense } from "react";
import Sidebar from "../component/navbar/sidebar/Sidebar";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    if (!session || !session.user?.access_token) redirect("/")

    return (
        <div className="row h-100">
            <Suspense fallback={<p>Loading...</p>}>
                <div className="col-2 h-100 text-white p-0" style={{ backgroundColor: "#0463CB" }}>
                    <Sidebar></Sidebar>
                </div>
                <div className="col-10 overflow-auto h-100 py-3 px-3">
                    {children}
                </div>
            </Suspense>
        </div>
    );
}

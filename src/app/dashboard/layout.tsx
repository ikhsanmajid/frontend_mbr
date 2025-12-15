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
                {/* Sidebar yang menangani mobile dan desktop */}
                <div className="col-lg-2 p-0">
                    <Sidebar></Sidebar>
                </div>
                <div className="col-12 col-lg-10 overflow-auto h-100 py-3 px-3">
                    {children}
                </div>
            </Suspense>
        </div>
    );
}

"use client"
import { useSession } from "next-auth/react";
import { SidebarElement } from "./SidebarElement";


export default function Sidebar() {
    const session = useSession()
    if (!session.data){
        return (
            <>
            </>
        )
    }

    return (
        <SidebarElement></SidebarElement>
    )
}
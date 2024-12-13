import "@/app/custom.css"
import { Collapse } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link"

export function SidebarElement() {
    const pathname = usePathname()
    const session = useSession()
    const [open, setOpen] = useState<{ name: string, open: boolean }[]>([]);
    const [activeLink, setActiveLink] = useState<string>("")

    const sideBarMenuAdmin = useMemo(() => [
        {
            id: "1",
            name: "Home",
            link: "/dashboard/admin",
            children: []
        },
        {
            name: "Master",
            link: "",
            children: [
                {
                    id: "2",
                    name: "Bagian",
                    link: "/dashboard/admin/bagian",
                },
                {
                    id: "3",
                    name: "Jabatan",
                    link: "/dashboard/admin/jabatan",
                },
                {
                    id: "4",
                    name: "Bagian VS Jabatan",
                    link: "/dashboard/admin/bagian_jabatan",
                },
                {
                    id: "5",
                    name: "Users",
                    link: "/dashboard/admin/users",
                },
                {
                    id: "6",
                    name: "Daftar Produk",
                    link: "/dashboard/admin/product",
                }
            ]
        },
        {
            name: "MBR",
            link: "",
            children: [
                {
                    id: "7",
                    name: "Daftar Permintaan",
                    link: "/dashboard/admin/transaction/permintaan",
                },
                {
                    id: "8",
                    name: "Konfirmasi Pengembalian",
                    link: "/dashboard/admin/transaction/pengembalian",
                },
            ]
        },{
            name: "Laporan",
            link: "",
            children: [
                {
                    id: "9",
                    name: "Download Laporan RB Belum Kembali",
                    link: "/dashboard/admin/report/download_rb_belum_kembali",
                },
                {
                    id: "10",
                    name: "Laporan Pembuatan RB",
                    link: "/dashboard/admin/report/laporan_pembuatan_rb",
                },
            ]
        },
        
    ], []);

    const sideBarMenuUser = useMemo(() => [
        {
            id: "50",
            name: "Home",
            link: "/users/home",
            children: []
        },
        {
            name: "Rekaman Batch",
            link: "",
            children: [{
                id: "51",
                name: "Permintaan Nomor RB",
                link: "/users/rb/permintaan/add",
            }, {
                id: "52",
                name: "List Permintaan Nomor RB",
                link: "/users/rb/permintaan/list",

            }, {
                id: "53",
                name: "Pengembalian RB",
                link: "/users/rb/pengembalian",

            }]
        },
    ], []);

    useEffect(() => {
        setActiveLink(pathname);
        console.log("pathname ", pathname)  
    }, [pathname]);

    useEffect(() => {
        const hasChildren = (session.data?.user?.is_admin == true ? sideBarMenuAdmin : sideBarMenuUser).filter(item => item.children.length > 0).map(item => ({ name: item.name, open: true }));
        setOpen(hasChildren);
        //console.log("data ", hasChildren)
    }, [sideBarMenuAdmin, sideBarMenuUser, session]);

    const handleToggle = (name: string) => {
        setOpen((prev) =>
            prev.map(item =>
                item.name === name ? { ...item, open: !item.open } : item
            )
        );
    };

    return (
        <div style={{ position: "fixed", height: "inherit", width: "inherit", overflowX: "scroll" }}>
            
            {(session.data?.user?.is_admin == true ? sideBarMenuAdmin : sideBarMenuUser).map((item, index) => (
                <div key={index} className="row">
                    <div className="row border-bottom">
                        {item.children.length > 0 ? (
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleToggle(item.name);
                                }}
                                style={{ cursor: "pointer" }}
                                className="text-white p-2 ms-3 fw-semibold"
                            >
                                {item.name}
                            </div>
                        ) : (
                            <Link href={item.link} className="text-white p-2 ms-3 fw-semibold" style={{ textDecoration: "none" }} passHref>
                                {item.name}
                            </Link>
                        )}
                    </div>

                    {item.children.length > 0 && (
                        <div className="row bg-whitesmoke m-0">
                            <Collapse in={open.find(val => val.name === item.name)?.open || false}>
                                <ul className="list-group list-group-flush" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                                    {item.children.map((child, childIndex) => (
                                        <li key={childIndex} className={`${activeLink.includes(child.link) ? "active" : ""} ps-3 py-2 fw-medium list-group-item border-skyblue`}>
                                            <Link href={child.link} className={activeLink.includes(child.link) ? "text-white" : "text-primary"} style={{ textDecoration: "none" }} passHref>
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Collapse>
                        </div>
                    )}

                </div>
            ))}
            
        </div>
    );
}
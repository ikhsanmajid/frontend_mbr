import "@/app/custom.css"
import "@/app/sidebar-enhanced.css"
import { Collapse } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHome, 
    faUsers, 
    faBuilding, 
    faUserTie, 
    faBoxes, 
    faTags, 
    faClipboardList, 
    faUndoAlt, 
    faFileDownload, 
    faChartBar,
    faBars,
    faTimes,
    faChevronDown,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'

interface MenuItem {
    id?: string
    name: string
    link: string
    icon?: any
    children: MenuItem[]
}

export function SidebarElement() {
    const pathname = usePathname()
    const session = useSession()
    const [open, setOpen] = useState<{ name: string, open: boolean }[]>([]);
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [navbarPlaceholder, setNavbarPlaceholder] = useState<HTMLElement | null>(null)

    const sideBarMenuAdmin: MenuItem[] = useMemo(() => [
        {
            id: "1",
            name: "Dashboard",
            link: "/dashboard/admin",
            icon: faHome,
            children: []
        },
        {
            name: "Master Data",
            link: "",
            icon: faBuilding,
            children: [
                {
                    id: "2",
                    name: "Bagian",
                    link: "/dashboard/admin/bagian",
                    icon: faBuilding,
                    children: []
                },
                {
                    id: "3",
                    name: "Jabatan",
                    link: "/dashboard/admin/jabatan",
                    icon: faUserTie,
                    children: []
                },
                {
                    id: "4",
                    name: "Bagian vs Jabatan",
                    link: "/dashboard/admin/bagian_jabatan",
                    icon: faUsers,
                    children: []
                },
                {
                    id: "5",
                    name: "Users",
                    link: "/dashboard/admin/users",
                    icon: faUsers,
                    children: []
                }, 
                {
                    id: "6",
                    name: "Kategori Produk",
                    link: "/dashboard/admin/category",
                    icon: faTags,
                    children: []
                },
                {
                    id: "7",
                    name: "Daftar Produk",
                    link: "/dashboard/admin/product",
                    icon: faBoxes,
                    children: []
                }
            ]
        },
        {
            name: "MBR Transaction",
            link: "",
            icon: faClipboardList,
            children: [
                {
                    id: "8",
                    name: "Daftar Permintaan",
                    link: "/dashboard/admin/transaction/permintaan",
                    icon: faClipboardList,
                    children: []
                },
                {
                    id: "9",
                    name: "Konfirmasi Pengembalian",
                    link: "/dashboard/admin/transaction/pengembalian",
                    icon: faUndoAlt,
                    children: []
                },
            ]
        }, 
        {
            name: "Laporan",
            link: "",
            icon: faChartBar,
            children: [
                {
                    id: "10",
                    name: "Download RB Belum Kembali",
                    link: "/dashboard/admin/report/download_rb_belum_kembali",
                    icon: faFileDownload,
                    children: []
                },
                {
                    id: "11",
                    name: "Laporan Pembuatan RB",
                    link: "/dashboard/admin/report/laporan_pembuatan_rb",
                    icon: faChartBar,
                    children: []
                },
            ]
        },
    ], [])

    const sideBarMenuUser: MenuItem[] = useMemo(() => [
        {
            id: "50",
            name: "Dashboard",
            link: "/dashboard/user",
            icon: faHome,
            children: []
        },
        {
            name: "Rekaman Batch",
            link: "",
            icon: faClipboardList,
            children: [
                {
                    id: "51",
                    name: "Permintaan Nomor RB",
                    link: "/users/rb/permintaan/add",
                    icon: faClipboardList,
                    children: []
                }, 
                {
                    id: "52",
                    name: "List Permintaan Nomor RB",
                    link: "/users/rb/permintaan/list",
                    icon: faClipboardList,
                    children: []
                }, 
                {
                    id: "53",
                    name: "Pengembalian RB",
                    link: "/users/rb/pengembalian",
                    icon: faUndoAlt,
                    children: []
                }
            ]
        },
        {
            name: "Laporan",
            link: "",
            icon: faChartBar,
            children: [
                {
                    id: "54",
                    name: "Laporan Serah Terima RB",
                    link: "/users/report/serah_terima_rb",
                    icon: faFileDownload,
                    children: []
                },
            ]
        },
    ], [])

    // Effects
    useEffect(() => {
        setIsMounted(true)
        // Cari placeholder di navbar untuk tombol toggle
        const placeholder = document.getElementById('sidebar-toggle-placeholder')
        setNavbarPlaceholder(placeholder)
    }, [])

    useEffect(() => {
        const menuItems = session.data?.user?.is_admin ? sideBarMenuAdmin : sideBarMenuUser
        const hasChildren = menuItems
            .filter(item => item.children.length > 0)
            .map(item => ({ name: item.name, open: true }))
        setOpen(hasChildren)
    }, [sideBarMenuAdmin, sideBarMenuUser, session])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMobileOpen) {
                setIsMobileOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isMobileOpen])

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('sidebar-menu')
            const toggleButton = document.querySelector('[aria-controls="sidebar-menu"]')
            
            if (
                isMobileOpen && 
                sidebar && 
                !sidebar.contains(event.target as Node) &&
                !toggleButton?.contains(event.target as Node)
            ) {
                setIsMobileOpen(false)
            }
        }

        if (isMobileOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobileOpen])

    // Handlers
    const handleToggle = (name: string) => {
        setOpen((prev) =>
            prev.map(item =>
                item.name === name ? { ...item, open: !item.open } : item
            )
        )
    }

    const handleMobileToggle = () => {
        setIsMobileOpen(!isMobileOpen)
    }

    const handleLinkClick = () => {
        setIsMobileOpen(false)
    }

    const isActive = (link: string): boolean => {
        return pathname === link || (pathname.startsWith(link) && pathname[link.length] === "/")
    }

    const isOpen = (name: string): boolean => {
        return open.find(val => val.name === name)?.open || false
    }

    const renderMenuItem = (item: MenuItem, index: number) => {
        const hasChildren = item.children.length > 0
        const isMenuOpen = isOpen(item.name)

        return (
            <div key={index} className="sidebar-item">
                <div className="sidebar-item-header border-bottom border-opacity-25">
                    {hasChildren ? (
                        <div
                            onClick={() => handleToggle(item.name)}
                            className="sidebar-link sidebar-parent d-flex align-items-center justify-content-between"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleToggle(item.name)}
                        >
                            <div className="d-flex align-items-center">
                                {item.icon && (
                                    <FontAwesomeIcon 
                                        icon={item.icon} 
                                        className="sidebar-icon me-3" 
                                    />
                                )}
                                <span className="sidebar-text">{item.name}</span>
                            </div>
                            <FontAwesomeIcon 
                                icon={isMenuOpen ? faChevronDown : faChevronRight}
                                className="sidebar-chevron"
                            />
                        </div>
                    ) : (
                        <Link 
                            href={item.link} 
                            className={`sidebar-link d-flex align-items-center ${isActive(item.link) ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            {item.icon && (
                                <FontAwesomeIcon 
                                    icon={item.icon} 
                                    className="sidebar-icon me-3" 
                                />
                            )}
                            <span className="sidebar-text">{item.name}</span>
                        </Link>
                    )}
                </div>

                {hasChildren && (
                    <Collapse in={isMenuOpen}>
                        <div className="sidebar-submenu bg-whitesmoke">
                            {item.children.map((child, childIndex) => (
                                <Link
                                    key={childIndex}
                                    href={child.link}
                                    className={`sidebar-sublink d-flex align-items-center ${isActive(child.link) ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    {child.icon && (
                                        <FontAwesomeIcon 
                                            icon={child.icon} 
                                            className="sidebar-subicon me-3" 
                                        />
                                    )}
                                    <span className="sidebar-text">{child.name}</span>
                                </Link>
                            ))}
                        </div>
                    </Collapse>
                )}
            </div>
        )
    }

    if (!isMounted) {
        return (
            <div className="d-none">
                <div className="d-flex justify-content-center align-items-center p-4">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (!session.data?.user) {
        return (
            <div className="d-none">
                <div className="alert alert-warning m-3" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Sesi tidak ditemukan
                </div>
            </div>
        )
    }

    const menuItems = session.data?.user?.is_admin ? sideBarMenuAdmin : sideBarMenuUser

    return (
        <>
            {navbarPlaceholder && createPortal(
                <button 
                    className="btn btn-outline-light d-flex align-items-center justify-content-center px-2 py-1"
                    onClick={handleMobileToggle}
                    aria-expanded={isMobileOpen}
                    aria-controls="sidebar-menu"
                    aria-label={isMobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                    style={{ border: 'none', background: 'transparent' }}
                >
                    <FontAwesomeIcon 
                        icon={isMobileOpen ? faTimes : faBars} 
                        size="lg"
                        className="text-white"
                    />
                </button>,
                navbarPlaceholder
            )}

            {/* Desktop Sidebar */}
            <div className="d-none d-lg-block h-100 text-white" style={{ backgroundColor: "#0463CB" }}>
                <div className="sidebar-content h-100">
                    <nav className="sidebar-nav pt-3">
                        {menuItems.map((item, index) => renderMenuItem(item, index))}
                    </nav>
                </div>
            </div>

            {/* Mobile */}
            {isMobileOpen && (
                <div 
                    className="sidebar-backdrop d-lg-none"
                    onClick={handleMobileToggle}
                />
            )}

            {/* Mobile Sidebar */}
            <div 
                id="sidebar-menu"
                className={`sidebar-menu d-lg-none ${isMobileOpen ? 'open' : ''}`}
            >
                <div className="sidebar-content">
                    <div className="sidebar-header d-lg-none mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <h5 className="text-white mb-0 fw-bold">
                                <FontAwesomeIcon icon={faBars} className="me-2" />
                                Menu Navigasi
                            </h5>
                            <button 
                                className="btn btn-link text-white p-0"
                                onClick={handleMobileToggle}
                                aria-label="Tutup menu navigasi"
                                tabIndex={0}
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>
                        <hr className="border-white border-opacity-25 mt-2 mb-0" />
                    </div>

                    <nav className="sidebar-nav">
                        {menuItems.map((item, index) => renderMenuItem(item, index))}
                    </nav>
                </div>
            </div>
        </>
    )
}
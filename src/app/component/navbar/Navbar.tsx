"use client"
import { signOut } from "next-auth/react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "@/app/custom.css"

export default function NavigationNav() {
    const { data: session, status } = useSession();

    return (
        <Navbar bg="primary" data-bs-theme="dark" sticky="top" className="border-bottom border-4 border-skyblue">
            <Container fluid className="mx-2 mx-sm-4">
                <div className="d-flex align-items-center flex-grow-1">
                    <div id="sidebar-toggle-placeholder" className="d-lg-none me-2 me-sm-3"></div>
                    <Navbar.Brand className="me-0">
                        <Link href="/" style={{ textDecoration: "none", color: "white" }} passHref>
                            Aplikasi e-RB
                        </Link>
                    </Navbar.Brand>
                </div>
                <div className="d-flex flex-column flex-sm-row align-items-end align-items-sm-center">
                    <Navbar.Toggle aria-controls="navbar-dark-example" className="mb-2 d-sm-none" />
                </div>
                <Navbar.Collapse id="navbar-dark-example">
                    <Nav className="ms-auto">
                        {status === "loading" ? (
                            <Nav.Link className="text-white">Loading...</Nav.Link>
                        ) : status === "authenticated" ? (
                            <NavDropdown
                                id="nav-dropdown"
                                title={
                                    <span className="d-inline-block user-name-display" 
                                          title={session.user?.name || "User"}>
                                        {session.user?.name || "User"}
                                    </span>
                                }
                                menuVariant="primary"
                                className="user-dropdown"
                            >
                                <Link href={`/dashboard/user/${session.user?.id}`} passHref legacyBehavior>
                                    <NavDropdown.Item as="a" style={{ textDecoration: "none", color: "white" }}>
                                        Profile
                                    </NavDropdown.Item>
                                </Link>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    onClick={async () => {
                                        localStorage.removeItem('idProdukChoosen');
                                        localStorage.removeItem('idBagianChoosen');
                                        await signOut({
                                            redirect: true,
                                            callbackUrl: "/mbr/login",
                                        });
                                    }}
                                >
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Link href="/login" passHref legacyBehavior>
                                <Nav.Link as="a" className="text-white">
                                    Login
                                </Nav.Link>
                            </Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
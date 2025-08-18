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
            <Container fluid className="mx-4">
                <Navbar.Brand>
                    <Link href="/" style={{ textDecoration: "none", color: "white" }} passHref>
                        Monitoring MBR
                    </Link>
                </Navbar.Brand>
                <Nav className="me-auto"></Nav>
                <Nav className="me-5">
                    {status === "loading" ? (
                        <Nav.Link className="text-white">Loading...</Nav.Link>
                    ) : status === "authenticated" ? (
                        <NavDropdown
                            id="nav-dropdown"
                            title={session.user?.name || "User"}
                            menuVariant="primary"
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
                                        callbackUrl: "/mbr/login"
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
            </Container>
        </Navbar>
    );
}
import type { AuthOptions, NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const apiURL = process.env.NEXT_PUBLIC_APIENDPOINT_URL as string


export const authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 2,
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials: any) {
                const user = await fetch(`${apiURL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    })
                })

                const result = await user.json()

                //console.log(result.errors[0].context)

                if (user.ok) {
                    return {
                        id: result.data.detail.id,
                        email: result.data.detail.email,
                        name: result.data.detail.nama,
                        access_token: result.data.access_token,
                        is_admin: result.data.detail.isAdmin,
                        is_active: result.data.detail.isActive,
                        bagian_jabatan: result.data.detail.bagian_jabatan,
                        expires: result.data.detail.exp
                    }
                }

                if (result.errors[0]) {
                    throw new Error(result.errors[0].message)
                }

                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Jika ada user baru (saat login), simpan token dan data user
            if (user) {
                token.id = user.id!;
                token.access_token = user.access_token!;
                token.email = user.email;
                token.name = user.name;
                token.is_admin = user.is_admin;
                token.bagian_jabatan = user.bagian_jabatan;
                token.expires_at = user.expires; // Simpan waktu kedaluwarsa
            }

            // Validasi token kedaluwarsa
            if (token.expires_at && Date.now() >= token.expires_at * 1000) {
                return {}; // Kosongkan token jika expired
            }

            return token;
        },
        async session({ session, token }) {
            // Jika token kosong (expired), arahkan ke logout
            if (!token || !token.access_token) {
                throw new Error("Token expired");
            }

            // Mapping token ke session
            if (session.user) {
                session.user.access_token = token.access_token;
                session.user.email = token.email || "";
                session.user.name = token.name || "";
                session.user.is_admin = token.is_admin === true;
                session.user.id = token.id ? parseInt(token.id) : null;
                session.user.bagian_jabatan = token.bagian_jabatan || null;
                session.user.expires_at = token.expires_at || null;
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl + '/login';
        },
    },
    pages: {
        signIn: "/login",
    }
} satisfies NextAuthOptions
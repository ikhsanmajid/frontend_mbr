import type { AuthOptions, NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const apiURL = process.env.NEXT_PUBLIC_APIENDPOINT_URL as string


export const authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 8,
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

            if (user) {
                token.id = user.id!
                token.access_token = user.access_token!
                token.email = user.email
                token.name = user.name
                token.is_admin = user.is_admin
                token.bagian_jabatan = user.bagian_jabatan
                token.expires_at = user.expires
            }

            return token
        },
        async redirect({ url, baseUrl }) {
            // Redirect jika token expired
            return url.startsWith(baseUrl) ? url + '?expired=true' : baseUrl + '/login?expired=true"';
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.access_token = token.access_token
                session.user.email = token.email ? token.email : ""
                session.user.name = token.name ? token.name : ""
                session.user.is_admin = token.is_admin == true ? true : false
                session.user.id = token.id ? parseInt(token.id) : null
                session.user.bagian_jabatan = token.bagian_jabatan ? token.bagian_jabatan : null
                session.user.expires_at = token.expires_at ? token.expires_at : null
            }

            return session
        },
    },
    pages: {
        signIn: "/login",
    }
} satisfies NextAuthOptions
import axios, { AxiosError } from "axios"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { CredentialsSignin } from "next-auth"


export const apiURL = process.env.NEXT_PUBLIC_APIENDPOINT_URL! as string

class CustomError extends CredentialsSignin {
    constructor(code: string) {
        super();
        this.code = code;
        this.stack = undefined;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 6,
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                // const user = await fetch(`${apiURL}/login`, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({
                //         email: credentials?.email,
                //         password: credentials?.password,
                //     })
                // })
                try {

                    const user = await axios.post(
                        `${apiURL}/login`,
                        {
                            email: credentials?.email,
                            password: credentials?.password
                        },
                        {
                            headers: { "Content-Type": "application/json" },
                            validateStatus: (status) => {
                                return status >= 200 && status < 500
                            },
                        })



                    // const result = await user.json()
                    const isOk = (user.status == 200 && user.data.type !== "error") ? true : false
                    //console.log("isOK: ", user.data)

                    //console.log(result.errors[0].context)

                    if (isOk) {
                        const data = user.data.data
                        //console.log("Status Response: ", data)
                        return {
                            id: data.detail.id,
                            email: data.detail.email,
                            name: data.detail.nama,
                            access_token: data.access_token,
                            is_admin: data.detail.isAdmin,
                            is_active: data.detail.isActive,
                            bagian_jabatan: data.detail.bagian_jabatan,
                            expires: data.detail.exp
                        }
                    }

                    if (user.data.errors[0]) {
                        const error = user.data.errors[0]
                        // throw new Error(user.data.errors[0].message)
                        //throw new InvalidLoginError()
                        //console.log("errors: ", user.data.errors)
                        throw new CustomError(error.message)
                        // console.log("errors: ", user.data.errors[0])
                    }

                    return null

                } catch (e: unknown) {
                    if (e instanceof AxiosError) {
                        throw new CustomError("Server Error")
                    } else {
                        throw e
                    }
                }


            }
        })
    ],
    trustHost: true,
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
        async session({ session, token }: { session: any; token: any }) {
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
                session.user.id = token.id ? parseInt(token.id as string) : null;
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
})
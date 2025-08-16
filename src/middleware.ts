// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'

// export async function middleware(request: NextRequest) {
//     const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

//     const loginUrl = `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/login?expired=true`;

//     // Cek jika sedang berada di halaman login
//     if (request.nextUrl.pathname === "/login") {
//         return NextResponse.next();
//     }

//     // Jika token tidak ada atau expired, redirect ke login
//     if (!token || (token.expires_at && Date.now() >= token.expires_at * 1000)) {
//         return NextResponse.redirect(loginUrl);
//     }

//     // Lanjutkan ke halaman yang diminta
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/((?!serveroffline|static|_next|api|$).*)',
//     ],
// };

import { NextResponse } from 'next/server'
import { auth } from "@/app/auth"
import axios, { AxiosError } from 'axios'

export default auth((req) => {
    const session = req.auth ?? null
    const isLogin = req.nextUrl.pathname === "/login"

    if (!req.auth && !isLogin) {

        const loginUrl = new URL(`/login?next=${encodeURIComponent(req.nextUrl.pathname)}`, req.nextUrl.origin)

        return NextResponse.redirect(loginUrl)
    }

    if (isLogin && session){
        return NextResponse.redirect(new URL(`/`, req.nextUrl.origin))
    }

    axios.get(`${process.env.NEXT_PUBLIC_APIENDPOINT_URL! as string}`).then(res => {
        return NextResponse.next()
    }).catch(e => {
        if (e instanceof AxiosError) {
            const serverOffline = new URL(`/server-offline?next=${encodeURIComponent(req.nextUrl.pathname)}`, req.nextUrl.origin)
            return NextResponse.redirect(serverOffline)
        }
    })

    return NextResponse.next()
})


export const config = {
    matcher: ["/login" ,"/dashboard/:path*", "/user/:path*"],
}
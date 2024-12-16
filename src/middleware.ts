import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const loginUrl = `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/login?expired=true`;

    // Cek jika sedang berada di halaman login
    if (request.nextUrl.pathname === "/login") {
        return NextResponse.next();
    }

    // Jika token tidak ada atau expired, redirect ke login
    if (!token || (token.expires_at && Date.now() >= token.expires_at * 1000)) {
        return NextResponse.redirect(loginUrl);
    }

    // Lanjutkan ke halaman yang diminta
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!serveroffline|static|_next|api|$).*)',
    ],
};
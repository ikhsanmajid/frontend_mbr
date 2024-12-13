import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiURL } from './app/lib/admin/users/userAPIRequest'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname != "/serveroffline") {
        try {
            const response = await fetch(apiURL)
            const checkServer = response.ok ? "OK" : response.statusText

            if (checkServer == "OK") {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ABSOLUTE_URL as string + "/serveroffline?dest=" + request.nextUrl.pathname)
            }
        } catch (e) {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ABSOLUTE_URL as string + "/serveroffline?dest=" + request.nextUrl.pathname)
        }
    }
}

export const config = {
    matcher: [
        '/((?!serveroffline|static|_next|api|$).*)',
    ],
};
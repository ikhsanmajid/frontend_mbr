import axios from 'axios'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname != "/serveroffline") {
        const checkServer = await axios.get('http://localhost:3001').then(data => {
            return data.statusText
        }).catch(e => {
            return e
        })

        if (checkServer == "OK") {
            NextResponse.next()
        } else {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ABSOLUTE_URL as string + "/serveroffline?dest=" + request.nextUrl.pathname)
        }
    }
}

export const config = {
    matcher: [
        '/((?!serveroffline|static|_next|api|$).*)',
    ],
};
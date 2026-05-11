import { NextRequest, NextResponse } from 'next/server'

const BLOCKED_PATTERNS = [
  /^\/\.env(\..*)?$/i,
  /^\/\.git(\/.*)?$/i,
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}

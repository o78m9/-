import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { applySecurityHeaders } from '@/lib/security-headers'
import { csrfCheck } from '@/lib/csrf'

function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const nonce = generateNonce()

  // CSRF guard for state-changing API requests.
  // NextAuth manages its own CSRF tokens — skip /api/auth/* to avoid breaking
  // OAuth callbacks (which arrive with cross-origin Referer by design).
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const csrf = csrfCheck(request)
    if (csrf) return csrf
  }

  let response = NextResponse.next({ request })
  response.headers.set('x-nonce', nonce)
  response = applySecurityHeaders(response, nonce)

  // Only auth-protect /dashboard/* routes (but not /dashboard/demo which is public)
  if (!pathname.startsWith('/dashboard') || pathname.startsWith('/dashboard/demo')) {
    return response
  }

  // Demo bypass — only the __Host- prefixed cookie is accepted.
  // __Host- cookies are automatically Secure + SameSite=Strict by the browser
  // spec and cannot be set by JavaScript on a subdomain.
  // The legacy "awdah-demo-mode" cookie (no __Host-, SameSite=Lax) has been
  // removed to prevent auth bypass via cross-site cookie injection.
  const demoCookie = request.cookies.get('__Host-awdah-demo')
  if (demoCookie?.value === 'true') {
    return response
  }

  // Skip auth check if Supabase not configured (dev without .env.local)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        const next = NextResponse.next({ request })
        next.headers.set('x-nonce', nonce)
        response = applySecurityHeaders(next, nonce)
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

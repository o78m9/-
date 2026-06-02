import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { applySecurityHeaders } from '@/lib/security-headers'
import { csrfCheck } from '@/lib/csrf'
import { verifyCookieValue } from '@/lib/signed-cookie'

function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const nonce = generateNonce()

  // CSRF guard for state-changing API requests.
  // WAP-003 fix: only OAuth callbacks legitimately arrive with cross-origin
  // Referer by design. The blanket `/api/auth/*` exemption used to bypass the
  // Origin check for /providers /session /csrf /signin /signout — narrowed
  // to /api/auth/callback/* only.
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/callback/')) {
    const csrf = csrfCheck(request)
    if (csrf) return csrf
  }

  let response = NextResponse.next({ request })
  response.headers.set('x-nonce', nonce)
  response = applySecurityHeaders(response, nonce)

  // Only auth-protect /dashboard/* routes (but not /dashboard/demo which is public).
  // RTA-010 fix: tighten prefix match so /dashboard/demolicious does NOT match.
  // Accept exact "/dashboard/demo" or anything strictly under "/dashboard/demo/".
  if (
    !pathname.startsWith('/dashboard') ||
    pathname === '/dashboard/demo' ||
    pathname.startsWith('/dashboard/demo/')
  ) {
    return response
  }

  // RTA-001 fix: demo bypass cookie is now HMAC-signed.
  // The __Host- prefix prevents cross-site setting; the HMAC binds the value
  // to a server-issued capability with expiry. Plain "true" is rejected.
  const demoCookie = request.cookies.get('__Host-awdah-demo')
  if (verifyCookieValue(demoCookie?.value) === 'true') {
    return response
  }

  // AUB-004 fix: fail closed in any deployed env if Supabase isn't configured.
  // Previously this returned `response` (public /dashboard/*) — which contradicted
  // the API-route default-deny posture and made misconfigured prod a public surface.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    const isDeployedEnv =
      process.env.VERCEL_ENV === 'production' ||
      process.env.VERCEL_ENV === 'preview' ||
      process.env.NODE_ENV === 'production'
    if (isDeployedEnv) {
      return new NextResponse(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }
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

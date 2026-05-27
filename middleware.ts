import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { applySecurityHeaders } from '@/lib/security-headers'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // Apply security headers to every response
  response = applySecurityHeaders(response)

  // Only auth-protect /dashboard/* routes
  if (!pathname.startsWith('/dashboard')) {
    return response
  }

  // Demo bypass — __Host- prefix, SameSite=Strict
  const demoCookie = request.cookies.get('__Host-awdah-demo')
  // Support legacy cookie name during transition
  const legacyCookie = request.cookies.get('awdah-demo-mode')
  if (demoCookie?.value === 'true' || legacyCookie?.value === 'true') {
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
        response = applySecurityHeaders(NextResponse.next({ request }))
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

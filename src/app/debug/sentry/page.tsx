/**
 * Dev-only Sentry probe.
 *
 * - Gated to non-production via the `notFound()` call below, so the route is
 *   invisible (404) in production builds even if someone discovers the path.
 * - Provides one button per Sentry surface (client + server) so we can verify
 *   the DSN is wired correctly without shipping a real error.
 *
 * How to test:
 *   1. Set NEXT_PUBLIC_SENTRY_DSN locally.
 *   2. Run `npm run dev` and visit /debug/sentry.
 *   3. Click each button — confirm an event lands in the Sentry project within
 *      ~30s. The server button hits an API route to test the server SDK.
 */
import { notFound } from 'next/navigation'
import { SentryProbe } from './probe'

export const dynamic = 'force-dynamic'

export default function SentryDebugPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-[480px] bg-paper rounded-2xl p-8 border border-line">
        <h1 className="font-sans font-bold text-ink text-[20px] mb-2">Sentry Debug</h1>
        <p className="text-mute text-[13px] mb-6">
          Dev-only probe to confirm Sentry capture is wired. Each button sends one event.
        </p>
        <SentryProbe />
      </div>
    </div>
  )
}

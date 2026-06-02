import * as Sentry from '@sentry/nextjs'
import { redactPii } from '@/lib/sentry-redact'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.VERCEL_ENV ?? 'development',
    sendDefaultPii: false,
    beforeSend: redactPii,
    beforeSendTransaction: redactPii,
  })
}

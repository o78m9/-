'use client'

import * as Sentry from '@sentry/nextjs'
import { useState } from 'react'

type Status = { kind: 'idle' } | { kind: 'ok'; msg: string } | { kind: 'err'; msg: string }

export function SentryProbe() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  function captureClientMessage() {
    try {
      Sentry.captureMessage('sentry-debug:client-message', 'info')
      setStatus({ kind: 'ok', msg: 'Client message captured.' })
    } catch (e) {
      setStatus({ kind: 'err', msg: e instanceof Error ? e.message : 'capture failed' })
    }
  }

  function captureClientException() {
    try {
      throw new Error('sentry-debug:client-exception')
    } catch (e) {
      Sentry.captureException(e)
      setStatus({ kind: 'ok', msg: 'Client exception captured.' })
    }
  }

  async function captureServerEvent() {
    setStatus({ kind: 'idle' })
    try {
      const r = await fetch('/api/debug/sentry', { method: 'POST' })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      setStatus({ kind: 'ok', msg: 'Server event dispatched.' })
    } catch (e) {
      setStatus({ kind: 'err', msg: e instanceof Error ? e.message : 'request failed' })
    }
  }

  const btn =
    'w-full h-11 rounded-xl bg-forest text-cream text-[14px] font-medium hover:bg-forest/90 transition-colors'

  return (
    <div className="space-y-3">
      <button type="button" onClick={captureClientMessage} className={btn}>
        Capture client message
      </button>
      <button type="button" onClick={captureClientException} className={btn}>
        Throw + capture client exception
      </button>
      <button type="button" onClick={captureServerEvent} className={btn}>
        Trigger server-side capture
      </button>
      {status.kind !== 'idle' && (
        <p
          className={status.kind === 'ok' ? 'text-[13px] text-forest' : 'text-[13px] text-rust'}
          role="status"
        >
          {status.msg}
        </p>
      )}
    </div>
  )
}

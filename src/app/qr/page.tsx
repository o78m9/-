'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function QRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [captureUrl, setCaptureUrl] = useState('')

  useEffect(() => {
    const clinicId = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || 'demo'
    const url = `${window.location.origin}/capture?clinic=${clinicId}`
    setCaptureUrl(url)

    import('qrcode').then(QRCode => {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 280,
          margin: 2,
          color: { dark: '#1d4ed8', light: '#ffffff' },
        })
      }
    })
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full print:shadow-none">
        <h1 className="text-xl font-bold text-blue-700 mb-1">عَودة</h1>
        <p className="text-sm text-gray-500 mb-6">سجّل بياناتك للحصول على خصم 10% في زيارتك القادمة</p>

        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="rounded-xl border" />
        </div>

        {captureUrl && (
          <p className="text-xs text-gray-400 font-mono break-all mb-6">{captureUrl}</p>
        )}

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 print:hidden"
        >
          طباعة
        </button>

        <Link href="/" className="block mt-3 text-sm text-gray-400 hover:underline print:hidden">
          ← الرئيسية
        </Link>
      </div>
    </main>
  )
}

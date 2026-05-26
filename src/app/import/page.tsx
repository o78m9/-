import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/header'
import ImportForm from '@/components/ImportForm'

export default function ImportPage() {
  const clinicId = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Header />
      <main id="main" className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <nav className="flex items-center gap-1.5 mb-8" aria-label="breadcrumb">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
            لوحة التحكم
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-sm text-slate-700 font-medium">استيراد البيانات</span>
        </nav>

        <div className="mb-8">
          <p className="label-caption mb-2">استيراد</p>
          <h1 className="text-display-sm font-semibold text-slate-900 leading-tight">
            أحضر قاعدة عملاءك
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            الصق من Excel أو WhatsApp أو أي مصدر — Claude ينظّف ويرتّب تلقائياً
          </p>
        </div>

        {clinicId ? (
          <ImportForm clinicId={clinicId} />
        ) : (
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 text-sm text-amber-800">
            أضف <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_DEMO_CLINIC_ID</code> في .env.local أولاً
          </div>
        )}
      </main>
    </div>
  )
}

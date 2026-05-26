'use client'

import { useState } from 'react'
import type { ImportedCustomer } from '@/types'

type Stage = 'input' | 'preview' | 'done'

export default function ImportForm({ clinicId }: { clinicId: string }) {
  const [rawText, setRawText] = useState('')
  const [stage, setStage] = useState<Stage>('input')
  const [preview, setPreview] = useState<ImportedCustomer[]>([])
  const [loading, setLoading] = useState(false)
  const [importedCount, setImportedCount] = useState(0)

  const handleClean = async () => {
    if (!rawText.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, clinic_id: clinicId, confirm: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطأ')
      setPreview(data.preview)
      setStage('preview')
    } catch (e: unknown) {
      alert('خطأ: ' + (e instanceof Error ? e.message : 'حاول مجدداً'))
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, clinic_id: clinicId, confirm: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطأ')
      setImportedCount(data.imported)
      setStage('done')
    } catch (e: unknown) {
      alert('خطأ: ' + (e instanceof Error ? e.message : 'حاول مجدداً'))
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'done') {
    return (
      <div className="text-center py-16 bg-white rounded-xl border">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-xl font-bold text-green-700">تم استيراد {importedCount} مريض</p>
        <button
          onClick={() => {
            setStage('input')
            setRawText('')
            setPreview([])
          }}
          className="mt-6 text-blue-600 text-sm hover:underline"
        >
          استيراد دفعة جديدة
        </button>
      </div>
    )
  }

  if (stage === 'preview') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium text-sm">
            تم تنظيف <span className="text-blue-600 font-bold">{preview.length}</span> سجل — راجع
            قبل التأكيد
          </p>
          <button
            onClick={() => setStage('input')}
            className="text-sm text-gray-500 hover:underline"
          >
            ← تعديل
          </button>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                    الاسم
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                    الهاتف
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                    آخر زيارة
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                    ملاحظة
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.map((c, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{c.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500" dir="ltr">
                      {c.phone}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{c.last_visit || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs max-w-xs truncate">
                      {c.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'جاري الاستيراد...' : `✓ تأكيد استيراد ${preview.length} مريض`}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white border rounded-xl p-4 mb-4">
        <label className="block text-sm font-medium mb-2">الصق بياناتك هنا</label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full h-52 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="يمكنك لصق بيانات من Excel، WhatsApp، أو أي مصدر آخر..."
          dir="auto"
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-sm text-blue-700">
        <p className="font-medium mb-2">أمثلة على البيانات المقبولة:</p>
        <pre className="text-xs font-mono whitespace-pre-wrap text-blue-600 leading-relaxed">{`اسم: رنا الأحمد، رقم: 0798765432، آخر زيارة: مارس 2024
محمد سالم 0791112233 تقويم
Hana Khaled - 0795551234 - last visit Jan 2024`}</pre>
      </div>

      <button
        onClick={handleClean}
        disabled={loading || !rawText.trim()}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? '⏳ Claude ينظف البيانات...' : '🤖 تنظيف واستخراج البيانات بـ AI'}
      </button>
    </div>
  )
}

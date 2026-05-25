import Link from 'next/link'
import { Megaphone, Plus, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">الحملات</h1>
            <p className="text-sm text-gray-500 mt-0.5">حملات إعادة تفعيل العملاء</p>
          </div>
          <Button asChild>
            <Link href="/campaigns/new">
              <Plus size={15} />
              حملة جديدة
            </Link>
          </Button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
            <Megaphone size={28} className="text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">لا توجد حملات بعد</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            أنشئ أول حملة الآن وأعد تفعيل عملائك الخاملين باستخدام رسائل مخصصة بالذكاء الاصطناعي
          </p>
          <Button asChild size="lg">
            <Link href="/campaigns/new">
              <Plus size={16} />
              إنشاء حملة الآن
            </Link>
          </Button>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
            <Clock size={11} />
            تستغرق 2 دقيقة فقط
          </p>
        </div>
      </div>
    </div>
  )
}

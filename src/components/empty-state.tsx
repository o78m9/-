'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Upload, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
        <Users size={28} className="text-teal-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">لا يوجد عملاء بعد</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        ابدأ باستيراد قاعدة بيانات عملائك أو أضف عميلاً جديداً الآن
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/capture">
            <Plus size={15} />
            عميل جديد
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/import">
            <Upload size={15} />
            استيراد البيانات
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Clock } from 'lucide-react'
import { Header } from '@/components/header'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Header />
      <main className="max-w-content mx-auto px-6 lg:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between mb-12"
        >
          <div>
            <p className="label-caption mb-2">الحملات</p>
            <h1 className="text-display-md font-semibold text-slate-900 leading-tight">
              أعد تفعيل عملاءك
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Claude يكتب رسالة مخصصة لكل عميل — لا قوالب جاهزة
            </p>
          </div>
          <div className="mt-1">
            <Button asChild size="lg">
              <Link href="/campaigns/new">
                <Plus size={16} />
                حملة جديدة
              </Link>
            </Button>
            <p className="text-xs text-slate-400 mt-2 flex items-center justify-end gap-1">
              <Clock size={10} />
              تستغرق دقيقتين
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <EmptyState variant="campaigns" />
        </motion.div>
      </main>
    </div>
  )
}

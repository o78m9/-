'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { StepIndicator } from './step-indicator'
import { StepSegment } from './step-segment'
import { StepTemplate } from './step-template'
import { StepPreview, type GeneratedMessage } from './step-preview'
import { StepSchedule } from './step-schedule'
import { StepReview } from './step-review'
import { SendProgress } from './send-progress'
import { Button } from '@/components/ui/button'
import { DEMO_STATS, DEMO_CUSTOMERS } from '@/lib/demo-data'

// Pre-baked demo messages (Arabic, Jordanian dialect)
const DEMO_MESSAGES: GeneratedMessage[] = [
  {
    customerId: '6',
    customerName: 'خالد الرشيد',
    lastVisit: '2024-11-05',
    message: 'مرحبا خالد، وحشتنا والله! مضى وقت طويل على آخر زيارة. كيف صحة أسنانك؟ عندنا وقت هالأسبوع إذا حابب تحجز 😊',
  },
  {
    customerId: '7',
    customerName: 'منى الحمود',
    lastVisit: '2024-08-22',
    message: 'أهلاً منى، تذكرناك اليوم! مرت فترة على زيارتك الأخيرة، وصحة الأسنان تحتاج متابعة دورية. ما رأيك بموعد خلال هالأسبوع؟',
  },
  {
    customerId: '3',
    customerName: 'هند الجابر',
    lastVisit: '2024-05-11',
    message: 'هلاً هند! اشتقنا لك بالعيادة 🌟 لو عندك أي استفسار أو بدك تحجز موعد، نحن موجودين دايماً. ننتظرك!',
  },
]

interface WizardProps {
  realCounts: Record<string, number>
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
}

export function CampaignWizard({ realCounts }: WizardProps) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [hasSent, setHasSent] = useState(false)

  // Step data
  const [segment, setSegment] = useState<string | null>('dormant')
  const [template, setTemplate] = useState<string | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now')
  const [scheduledAt, setScheduledAt] = useState('')
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)

  useEffect(() => {
    setIsDemoMode(localStorage.getItem('awdah-demo-mode') === 'true')
  }, [])

  const counts = isDemoMode ? DEMO_STATS : realCounts

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const generateMessages = useCallback(async () => {
    setIsGenerating(true)
    setMessages([])

    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 1800))
      setMessages(DEMO_MESSAGES)
      setIsGenerating(false)
      return
    }

    try {
      // Use demo customers for preview regardless (it's a preview, not the real send)
      const previewCustomers = DEMO_CUSTOMERS.slice(0, 3).map((c) => ({
        id: c.id,
        name: c.name,
        last_visit: c.last_visit,
        total_spent: c.total_spent,
        notes: null,
      }))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customers: previewCustomers,
          template: template ?? 'friendly',
          customMessage,
          clinicName: 'عيادة الأسنان',
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMessages(data.messages)
    } catch {
      toast.error('تعذّر توليد الرسائل — تحقق من مفتاح API')
      // Fallback to demo messages
      setMessages(DEMO_MESSAGES)
    } finally {
      setIsGenerating(false)
    }
  }, [isDemoMode, template, customMessage])

  const regenerateOne = async (customerId: string) => {
    if (isDemoMode) {
      setRegeneratingId(customerId)
      await new Promise((r) => setTimeout(r, 1200))
      const customer = DEMO_CUSTOMERS.find((c) => c.id === customerId)
      const variations = [
        'مرحبا، وحشتنا كثير! أسنانك تستاهل عناية. احجز موعدك معنا هالأسبوع 😊',
        'أهلاً! ذكرناك اليوم بالعيادة — كيف صحتك؟ عندنا أوقات مناسبة لو بدك تمر.',
        'هلاً! فترة ما شفناك، نأمل أن تكون بخير. ننتظر زيارتك القريبة 🌟',
      ]
      setMessages((prev) =>
        prev.map((m) =>
          m.customerId === customerId
            ? { ...m, message: variations[Math.floor(Math.random() * variations.length)] }
            : m
        )
      )
      setRegeneratingId(null)
      return
    }

    setRegeneratingId(customerId)
    try {
      const customer = DEMO_CUSTOMERS.find((c) => c.id === customerId)
      if (!customer) return
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customers: [customer],
          template: template ?? 'friendly',
          customMessage,
          clinicName: 'عيادة الأسنان',
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMessages((prev) =>
        prev.map((m) => (m.customerId === customerId ? data.messages[0] : m))
      )
    } catch {
      toast.error('تعذّر إعادة التوليد')
    } finally {
      setRegeneratingId(null)
    }
  }

  // Auto-generate when entering step 3
  useEffect(() => {
    if (step === 3 && messages.length === 0 && !isGenerating) {
      generateMessages()
    }
  }, [step, messages.length, isGenerating, generateMessages])

  const handleSend = async () => {
    setIsSending(true)
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600))
    setHasSent(true)
    toast.success('تم إطلاق الحملة بنجاح!')
  }

  const canContinue = () => {
    if (step === 1) return !!segment && ((counts as Record<string, number>)[segment] ?? 0) > 0
    if (step === 2) return !!template && (template !== 'custom' || customMessage.trim().length > 5)
    if (step === 3) return messages.length > 0 && !isGenerating
    if (step === 4) return scheduleType === 'now' || !!scheduledAt
    return true
  }

  if (hasSent) {
    return (
      <SendProgress
        customerCount={(counts as Record<string, number>)[segment ?? 'dormant'] ?? 32}
        segment={segment ?? 'dormant'}
        isDemoMode={isDemoMode}
      />
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator current={step} />
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as never }}
          >
            {step === 1 && (
              <StepSegment selected={segment} counts={counts} onSelect={setSegment} />
            )}
            {step === 2 && (
              <StepTemplate
                selected={template}
                customMessage={customMessage}
                onSelect={(t) => {
                  setTemplate(t)
                  // Clear cached messages when template changes
                  setMessages([])
                }}
                onCustomChange={setCustomMessage}
              />
            )}
            {step === 3 && (
              <StepPreview
                isGenerating={isGenerating}
                messages={messages}
                onRegenerate={regenerateOne}
                regeneratingId={regeneratingId}
              />
            )}
            {step === 4 && (
              <StepSchedule
                scheduleType={scheduleType}
                scheduledAt={scheduledAt}
                onTypeChange={setScheduleType}
                onDateChange={setScheduledAt}
              />
            )}
            {step === 5 && (
              <StepReview
                segment={segment ?? ''}
                template={template ?? ''}
                scheduleType={scheduleType}
                scheduledAt={scheduledAt}
                customerCount={(counts as Record<string, number>)[segment ?? 'dormant'] ?? 0}
                isSending={isSending}
                onSend={handleSend}
                isDemoMode={isDemoMode}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step > 1 ? goTo(step - 1) : null)}
            disabled={step === 1}
            className="gap-1"
          >
            <ChevronRight size={16} />
            السابق
          </Button>

          <Button
            onClick={() => goTo(step + 1)}
            disabled={!canContinue()}
            className="gap-2 px-6"
          >
            {step === 4 ? 'مراجعة الحملة' : 'التالي'}
          </Button>
        </div>
      )}
    </div>
  )
}

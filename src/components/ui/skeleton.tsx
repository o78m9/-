import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'chart'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const base =
    'animate-pulse rounded-lg bg-gradient-to-r from-line/60 via-line/40 to-line/60 bg-[length:200%_100%] animate-shimmer'

  const variants = {
    default: 'h-4 w-full',
    card: 'h-40 w-full rounded-xl',
    text: 'h-3.5 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    chart: 'h-48 w-full rounded-xl',
  }

  return <div className={cn(base, variants[variant], className)} aria-hidden="true" />
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border border-line/60 p-5 space-y-3"
      role="status"
      aria-label="جاري التحميل..."
    >
      <Skeleton variant="avatar" className="w-10 h-10" />
      <Skeleton variant="default" className="h-5 w-2/3" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  )
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="جاري التحميل...">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton variant="avatar" className="w-8 h-8 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="default" className="h-3.5 w-1/2" />
            <Skeleton variant="text" className="w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div
      className="rounded-xl border border-line/60 p-5"
      role="status"
      aria-label="جاري التحميل..."
    >
      <Skeleton className="h-4 w-1/3 mb-5" />
      <Skeleton variant="chart" />
    </div>
  )
}

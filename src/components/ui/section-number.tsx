const ARABIC_INDIC = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

function toAI(n: number, pad = 2): string {
  return String(n)
    .padStart(pad, '0')
    .split('')
    .map((d) => (d >= '0' && d <= '9' ? ARABIC_INDIC[parseInt(d)] : d))
    .join('')
}

interface SectionNumberProps {
  n: number
  label?: string
}

export function SectionNumber({ n, label }: SectionNumberProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span
        className="font-fraunces text-copper leading-none select-none"
        style={{ fontSize: 15, letterSpacing: '0.01em' }}
        aria-hidden="true"
      >
        {toAI(n)}
      </span>
      {label && (
        <>
          <span className="w-6 h-px bg-line" aria-hidden="true" />
          <span className="text-[12px] font-[500] tracking-[0.08em] uppercase text-mute">
            {label}
          </span>
        </>
      )}
    </div>
  )
}

export function toArabicIndic(n: number): string {
  return toAI(n, 0)
}

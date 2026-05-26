// Abstract geometric marks — no clinic names, visual rhythm only
const MARKS = [
  // Two overlapping circles
  <svg key="m1" width="52" height="32" viewBox="0 0 52 32" fill="none" aria-hidden="true">
    <circle cx="14" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="30" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // Cross in circle
  <svg key="m2" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="16"
      y1="7"
      x2="16"
      y2="25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="16"
      x2="25"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>,
  // Three stacked bars (different widths)
  <svg key="m3" width="40" height="32" viewBox="0 0 40 32" fill="none" aria-hidden="true">
    <rect x="0" y="7" width="40" height="3" rx="1.5" fill="currentColor" />
    <rect x="5" y="15" width="30" height="3" rx="1.5" fill="currentColor" />
    <rect x="10" y="23" width="20" height="3" rx="1.5" fill="currentColor" />
  </svg>,
  // Diamond outline
  <svg key="m4" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <polygon
      points="16,2 30,16 16,30 2,16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
  // Rounded rect with inner rule
  <svg key="m5" width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="44" height="24" rx="8" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="12"
      y1="16"
      x2="36"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>,
  // Three dots in triangle
  <svg key="m6" width="36" height="32" viewBox="0 0 36 32" fill="none" aria-hidden="true">
    <circle cx="18" cy="5" r="4" fill="currentColor" />
    <circle cx="5" cy="27" r="4" fill="currentColor" />
    <circle cx="31" cy="27" r="4" fill="currentColor" />
  </svg>,
  // Concentric circles
  <svg key="m7" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // Pentagon
  <svg key="m8" width="34" height="32" viewBox="0 0 34 32" fill="none" aria-hidden="true">
    <polygon
      points="17,2 32,12 26,29 8,29 2,12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
]

export function LogoBar() {
  return (
    <section className="py-16 border-y border-[#E8E6E0] bg-white" aria-label="عيادات موثوقة">
      <div className="max-w-content mx-auto px-6">
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C5C5C] mb-10">
          موثوق من عيادات الأسنان الرائدة
        </p>
        <div
          className="flex items-center justify-center flex-wrap gap-10"
          style={{ color: '#5C5C5C', opacity: 0.55 }}
        >
          {MARKS.map((mark, i) => (
            <div key={i} className="flex items-center justify-center">
              {mark}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

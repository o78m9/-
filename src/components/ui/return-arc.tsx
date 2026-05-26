interface ReturnArcProps {
  width?: number
  height?: number
  className?: string
  strokeWidth?: number
}

export function ReturnArc({
  width = 600,
  height = 80,
  strokeWidth = 1.5,
  className = '',
}: ReturnArcProps) {
  const cx = width / 2
  const cy = height * 0.08
  const d = `M 0 ${height} C ${cx * 0.4} ${cy} ${cx * 1.6} ${cy} ${width} ${height}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <path d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

export function ArcDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        fill="none"
        className="w-full"
        style={{ height: 40 }}
      >
        <path
          d="M 0 36 C 300 4 900 4 1200 36"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

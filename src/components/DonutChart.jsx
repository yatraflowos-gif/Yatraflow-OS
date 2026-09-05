export default function DonutChart({ data, total, centerLabel }) {
  const size = 160
  const strokeWidth = 22
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativePercent = 0

  return (
    <div className="relative w-40 h-40 shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {data.map((seg, i) => {
          const percent = seg.value / total
          const dash = percent * circumference
          const gap = circumference - dash
          const offset = cumulativePercent * circumference
          cumulativePercent += percent
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-xs text-gray-500">{centerLabel}</span>
      </div>
    </div>
  )
}

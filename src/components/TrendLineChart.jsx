import { useState } from 'react'

export default function TrendLineChart({ labels, values, color = '#2563eb', height = 180 }) {
  const width = 600
  const max = Math.max(...values, 1)
  const [hoverIdx, setHoverIdx] = useState(null)

  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - (val / max) * (height - 20) - 10
    return { x, y, val }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="relative w-full overflow-x-auto">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="min-w-[500px]">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoverIdx === i ? 5 : 3}
            fill={color}
            className="cursor-pointer"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          />
        ))}
        {hoverIdx !== null && (
          <g>
            <rect
              x={Math.min(Math.max(points[hoverIdx].x - 30, 0), width - 60)}
              y={points[hoverIdx].y - 32}
              width="60"
              height="22"
              rx="6"
              fill="#1a2332"
            />
            <text
              x={Math.min(Math.max(points[hoverIdx].x, 30), width - 30)}
              y={points[hoverIdx].y - 17}
              textAnchor="middle"
              fontSize="11"
              fill="#e5e7eb"
            >
              {points[hoverIdx].val}
            </text>
          </g>
        )}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-600 mt-1 px-1">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  )
}

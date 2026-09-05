import { MapPin } from 'lucide-react'

// Structural placeholder for the hero "route across mountains" banner.
// Replace the mountain SVG/backdrop with founder-supplied hero art when available;
// keep the two location pins + dashed route as they're driven by real data (top destinations).
export default function RouteMapBanner({ pointA, pointB }) {
  return (
    <div className="relative h-32 rounded-xl overflow-hidden bg-base-900 border border-base-700">
      <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <polygon points="0,200 0,120 150,40 280,110 420,20 600,130 760,60 900,140 1050,50 1200,120 1200,200" fill="#111827" />
        <polygon points="0,200 0,160 200,100 400,150 650,80 850,160 1050,100 1200,160 1200,200" fill="#0d1220" />
      </svg>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M 150 70 Q 500 30 1050 70" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
      </svg>
      <div className="absolute" style={{ left: '11%', top: '28%' }}>
        <MapPin size={22} className="text-accent-500 fill-accent-500/20" />
        <span className="text-xs text-gray-300 whitespace-nowrap -ml-2">{pointA}</span>
      </div>
      <div className="absolute" style={{ left: '85%', top: '18%' }}>
        <MapPin size={22} className="text-accent-500 fill-accent-500/20" />
        <span className="text-xs text-gray-300 whitespace-nowrap -ml-2">{pointB}</span>
      </div>
    </div>
  )
}

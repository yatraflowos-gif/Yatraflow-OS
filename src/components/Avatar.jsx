const COLORS = [
  'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600',
  'bg-amber-600', 'bg-cyan-600', 'bg-pink-600',
]

function hashColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function getInitials(name) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function Avatar({ name, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-xs'
  return (
    <div className={`${sizeClass} ${hashColor(name || 'U')} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
      {getInitials(name || 'U')}
    </div>
  )
}

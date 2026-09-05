// Placeholder logo — replace with founder-supplied AK mountain + road logo asset.
// Keep this component isolated so the real asset can be swapped in without touching layout code.
export default function Logo({ size = 'md' }) {
  const isLarge = size === 'lg'
  return (
    <div className="flex items-center gap-2">
      <div className={`${isLarge ? 'w-11 h-11 text-base' : 'w-8 h-8 text-sm'} rounded-md bg-accent-600 flex items-center justify-center text-white font-bold`}>
        Y
      </div>
      <div className="leading-tight">
        <div className={`${isLarge ? 'text-xl' : 'text-sm'} font-bold text-white tracking-wide`}>
          YATRAFLOW <span className="text-accent-500">OS</span>
        </div>
        {isLarge && <div className="text-xs text-gray-500 tracking-wide">Tour Operator OS</div>}
      </div>
    </div>
  )
}

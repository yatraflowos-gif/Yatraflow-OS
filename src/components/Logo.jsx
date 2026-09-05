// Placeholder logo — replace with founder-supplied AK mountain + road logo asset.
// Keep this component isolated so the real asset can be swapped in without touching layout code.
export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-accent-600 flex items-center justify-center text-white font-bold text-sm">
        Y
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold text-white tracking-wide">
          YATRAFLOW <span className="text-accent-500">OS</span>
        </div>
      </div>
    </div>
  )
}

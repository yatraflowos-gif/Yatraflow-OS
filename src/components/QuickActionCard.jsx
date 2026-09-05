export default function QuickActionCard({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-800 text-left transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-base-800 flex items-center justify-center text-accent-500 shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-sm text-gray-200">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </button>
  )
}

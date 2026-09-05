export default function StatCardDetailed({ icon: Icon, label, value, sublabel, sublabelColor = 'text-gray-500', color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-500/15 text-blue-400',
    red: 'bg-red-500/15 text-red-400',
    purple: 'bg-purple-500/15 text-purple-400',
    green: 'bg-green-500/15 text-green-400',
    amber: 'bg-amber-500/15 text-amber-400',
  }
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4 flex-1 min-w-[160px]">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
          <Icon size={18} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {sublabel && <div className={`text-xs mt-1 ${sublabelColor}`}>{sublabel}</div>}
    </div>
  )
}

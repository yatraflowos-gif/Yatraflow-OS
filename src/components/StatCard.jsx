export default function StatCard({ icon: Icon, label, value, trend, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-500/15 text-blue-400',
    green: 'bg-green-500/15 text-green-400',
    amber: 'bg-amber-500/15 text-amber-400',
    purple: 'bg-purple-500/15 text-purple-400',
  }
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4 flex-1 min-w-[150px]">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[color] || colorMap.blue}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {trend && <div className="text-xs text-green-400 mt-1">{trend}</div>}
    </div>
  )
}

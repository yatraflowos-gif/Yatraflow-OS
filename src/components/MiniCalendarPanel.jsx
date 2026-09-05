import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { formatDate } from '../utils/formatters'
import { getPriorityStyle } from '../utils/priority'

export default function MiniCalendarPanel({ date, items, onNavigate, onViewAll }) {
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 tracking-wide">FOLLOW-UP CALENDAR</h3>
        <CalendarIcon size={14} className="text-gray-500" />
      </div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onNavigate?.(-1)} className="text-gray-500 hover:text-gray-300">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gray-200">{formatDate(date)}</span>
        <button onClick={() => onNavigate?.(1)} className="text-gray-500 hover:text-gray-300">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="relative pl-4 space-y-3 border-l border-base-700 ml-1">
        {items.length === 0 && <p className="text-xs text-gray-600">No follow-ups scheduled.</p>}
        {items.map((item) => {
          const style = getPriorityStyle(item.priority)
          return (
            <div key={item.id} className="relative">
              <span className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ${style.dot}`} />
              <div className="bg-base-800 rounded-lg p-2.5">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-200">{item.title}</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>
              </div>
            </div>
          )
        })}
      </div>
      {onViewAll && (
        <button onClick={onViewAll} className="text-xs text-accent-500 mt-3">
          View full calendar
        </button>
      )}
    </div>
  )
}

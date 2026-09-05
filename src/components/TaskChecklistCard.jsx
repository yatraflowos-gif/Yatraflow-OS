import { useState } from 'react'
import { Check } from 'lucide-react'

export default function TaskChecklistCard({ tasks, onToggle, onViewAll }) {
  return (
    <div className="bg-base-900 border border-base-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200">Tasks Due Today</h2>
        {onViewAll && <button onClick={onViewAll} className="text-xs text-accent-500">View All</button>}
      </div>
      <div className="space-y-3">
        {tasks.length === 0 && <p className="text-xs text-gray-600">No tasks due today.</p>}
        {tasks.map((t) => (
          <div key={t.id} className="flex items-start gap-3">
            <button
              onClick={() => onToggle?.(t.id)}
              className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 border ${
                t.done ? 'bg-green-600 border-green-600' : 'border-base-600'
              }`}
            >
              {t.done && <Check size={12} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${t.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{t.title}</div>
              <div className="text-xs text-gray-500 truncate">{t.subtitle}</div>
            </div>
            <span className="text-xs text-gray-500 shrink-0">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

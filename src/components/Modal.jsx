import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-base-900 border border-base-700 rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-700 sticky top-0 bg-base-900">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

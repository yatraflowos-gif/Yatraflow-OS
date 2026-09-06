import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user, logout } = useAuth()
  const [orgName, setOrgName] = useState(user?.orgName || '')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    localStorage.setItem('yf_org_name', orgName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and organization</p>
      </div>

      <div className="bg-base-900 border border-base-700 rounded-xl p-4">
        <h2 className="text-sm font-medium text-gray-300 mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-200">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-200">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="text-gray-200">{user?.role}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-base-900 border border-base-700 rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-gray-300">Organization</h2>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Organization Name</label>
          <input className="input" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        </div>
        <button type="submit" className="bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
          Save Changes
        </button>
        {saved && <span className="text-xs text-green-400 ml-2">Saved!</span>}
      </form>

      <button
        onClick={logout}
        className="w-full bg-red-600/15 hover:bg-red-600/25 text-red-400 text-sm font-medium py-2.5 rounded-lg"
      >
        Log out
      </button>
    </div>
  )
}

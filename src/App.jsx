import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import FollowUps from './pages/FollowUps'
import Quotations from './pages/Quotations'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import CustomerDetails from './pages/CustomerDetails'
import Payments from './pages/Payments'
import Settings from './pages/Settings'
import Itineraries from './pages/Itineraries'
import Packages from './pages/Packages'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="follow-ups" element={<FollowUps />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="itineraries" element={<Itineraries />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="packages" element={<Packages />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

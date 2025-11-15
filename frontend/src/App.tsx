import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import MapView from './components/MapView'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardMain from './pages/merchant/DashboardMain'
import PromotionsList from './pages/merchant/PromotionsList'
import PromotionForm from './pages/merchant/PromotionForm'
import ValidateCoupons from './pages/merchant/ValidateCoupons'
import Profile from './pages/merchant/Profile'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import MapPage from './pages/MapPage'
import PromotionDetail from './pages/PromotionDetail'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingPromotions from './pages/admin/PendingPromotions'
import ManageCommerces from './pages/admin/ManageCommerces'
import AdminSearch from './pages/admin/AdminSearch'

function InnerApp() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">VecinAPP</Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700">Inicio</Link>
            <Link to="/map" className="text-gray-700">Mapa</Link>
            {!user && <Link to='/login' className='text-gray-700'>Login</Link>}
            {user?.role === 'ADMIN' && <Link to='/admin' className='text-gray-700'>Admin</Link>}
            {user?.role === 'COMMERCE' && <Link to='/merchant' className='text-gray-700'>Comercio</Link>}
            {user && <button onClick={logout} className='text-gray-700'>Salir</button>}
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/promotions/:id" element={<PromotionDetail />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          <Route path="/merchant" element={<ProtectedRoute requireRole="commerce"><DashboardMain /></ProtectedRoute>} />
          <Route path="/merchant/promotions" element={<ProtectedRoute requireRole="commerce"><PromotionsList /></ProtectedRoute>} />
          <Route path="/merchant/promotions/new" element={<ProtectedRoute requireRole="commerce"><PromotionForm /></ProtectedRoute>} />
          <Route path="/merchant/promotions/:id/edit" element={<ProtectedRoute requireRole="commerce"><PromotionForm /></ProtectedRoute>} />
          <Route path="/merchant/validate" element={<ProtectedRoute requireRole="commerce"><ValidateCoupons /></ProtectedRoute>} />
          <Route path="/merchant/profile" element={<ProtectedRoute requireRole="commerce"><Profile /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/promotions" element={<ProtectedRoute requireRole="admin"><PendingPromotions /></ProtectedRoute>} />
          <Route path="/admin/commerce" element={<ProtectedRoute requireRole="admin"><ManageCommerces /></ProtectedRoute>} />
          <Route path="/admin/search" element={<ProtectedRoute requireRole="admin"><AdminSearch /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

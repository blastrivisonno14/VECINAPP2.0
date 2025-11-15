import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function MerchantNavbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <header className="bg-white shadow p-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/merchant" className="font-bold">Mi Comercio</Link>
          <Link to="/merchant/promotions" className="text-sm text-gray-600">Mis promociones</Link>
          <Link to="/merchant/promotions/new" className="text-sm text-gray-600">Crear promo</Link>
          <Link to="/merchant/validate" className="text-sm text-gray-600">Validar cupones</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700">{user?.name || user?.email}</div>
          <button className="text-sm text-red-600" onClick={() => { logout(); nav('/'); }}>Cerrar sesión</button>
        </div>
      </div>
    </header>
  )
}

export default MerchantNavbar

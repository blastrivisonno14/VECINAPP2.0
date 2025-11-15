import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminNavbar(){
  const { user, logout } = useAuth()
  return (
    <header className="bg-white shadow p-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="font-bold">Admin</Link>
          <Link to="/admin/promotions" className="text-sm text-gray-600">Pendientes</Link>
          <Link to="/admin/commerce" className="text-sm text-gray-600">Comercios</Link>
          <Link to="/admin/search" className="text-sm text-gray-600">Buscar</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700">{user?.email}</div>
          <button className="text-sm text-red-600" onClick={() => logout()}>Cerrar sesión</button>
        </div>
      </div>
    </header>
  )
}

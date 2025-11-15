import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import axios from 'axios'

export default function AdminDashboard(){
  const [stats, setStats] = useState<any>(null)
  useEffect(() => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.get(`${BACKEND}/admin/stats`).then(r => setStats(r.data)).catch(() => {})
  }, [])
  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Admin - Estadísticas</h1>
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">Usuarios: <strong>{stats.usersCount}</strong></div>
            <div className="bg-white p-4 rounded shadow">Comercios: <strong>{stats.commercesCount}</strong></div>
            <div className="bg-white p-4 rounded shadow">Promociones activas: <strong>{stats.activePromotions}</strong></div>
          </div>
        ) : <div>Cargando...</div>}
      </div>
    </div>
  )
}

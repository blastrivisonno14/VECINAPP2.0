import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import axios from 'axios'

export default function ManageCommerces(){
  const [commerces, setCommerces] = useState<any[]>([])
  useEffect(() => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.get(`${BACKEND}/commerces`).then(r => setCommerces(r.data || []))
  }, [])

  const activate = async (id: number) => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    await axios.patch(`${BACKEND}/admin/commerces/${id}/activate`)
    setCommerces(c => c.map(x => x.id === id ? { ...x, isActive: true } : x))
  }

  const deactivate = async (id: number) => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    await axios.patch(`${BACKEND}/admin/commerces/${id}/deactivate`)
    setCommerces(c => c.map(x => x.id === id ? { ...x, isActive: false } : x))
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Gestionar comercios</h1>
        <div className="space-y-3">
          {commerces.map(c => (
            <div key={c.id} className="bg-white p-3 rounded shadow flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-600">{c.address}</div>
              </div>
              <div className="flex gap-2">
                {c.isActive ? (
                  <button onClick={() => deactivate(c.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Desactivar</button>
                ) : (
                  <button onClick={() => activate(c.id)} className="px-3 py-1 bg-green-600 text-white rounded">Activar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

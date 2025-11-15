import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
import axios from 'axios'

export default function PendingPromotions(){
  const [promos, setPromos] = useState<any[]>([])
  useEffect(() => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.get(`${BACKEND}/admin/promotions/pending`).then(r => setPromos(r.data || []))
  }, [])

  const approve = async (id: number) => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    await axios.patch(`${BACKEND}/admin/promotions/${id}/approve`)
    setPromos(p => p.filter(x => x.id !== id))
  }

  const remove = async (id: number) => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    await axios.delete(`${BACKEND}/admin/promotions/${id}`)
    setPromos(p => p.filter(x => x.id !== id))
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Promociones pendientes</h1>
        <div className="space-y-3">
          {promos.map(p => (
            <div key={p.id} className="bg-white p-3 rounded shadow flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">Comercio: {p.commerce?.name}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(p.id)} className="px-3 py-1 bg-green-600 text-white rounded">Aprobar</button>
                <button onClick={() => remove(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

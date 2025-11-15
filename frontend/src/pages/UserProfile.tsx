import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function UserProfile() {
  const { user, token } = useAuth()
  const [coupons, setCoupons] = useState<any[]>([])

  useEffect(() => {
    if (!token) return
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.get(`${BACKEND}/coupons/me`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => setCoupons(r.data || []))
  }, [token])

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold">Perfil</h2>
          <div className="text-sm text-gray-700">{user?.name || user?.email}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Historial de cupones</h3>
          <div className="space-y-2">
            {coupons.map((c) => (
              <div key={c.id} className="p-2 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">Cupón #{c.id}</div>
                  <div className="text-sm text-gray-600">Promoción: {c.promotionId}</div>
                </div>
                <div className="text-sm text-gray-500">{c.redeemedAt ? new Date(c.redeemedAt).toLocaleString() : 'No canjeado'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

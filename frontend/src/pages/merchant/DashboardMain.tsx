import React, { useEffect, useState } from 'react'
import MerchantNavbar from '../../components/MerchantNavbar'
import MetricCard from '../../components/MetricCard'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function DashboardMain() {
  const [metrics, setMetrics] = useState<{ views: number; redemptions: number; activePromos: number }>({ views: 0, redemptions: 0, activePromos: 0 })
  const [commerce, setCommerce] = useState<any>(null)
  const { token } = useAuth()

  useEffect(() => {
    const fetchMetrics = async () => {
      const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
      // Example endpoint: /commerces/:id/metrics (not implemented in backend here)
      // For demo, we call /promotions and compute simple numbers
      const res = await axios.get(`${BACKEND}/promotions`)
      const promotions = res.data
      setMetrics({ views: 0, redemptions: 0, activePromos: promotions.length })
    }
    fetchMetrics()
  }, [])

  useEffect(() => {
    const fetchCommerce = async () => {
      if (!token) return
      const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
      try {
        const res = await axios.get(`${BACKEND}/commerces/mine`, { headers: { Authorization: `Bearer ${token}` } })
        setCommerce(res.data)
      } catch {
        setCommerce(null)
      }
    }
    fetchCommerce()
  }, [token])

  return (
    <div>
      <MerchantNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        {!commerce && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
            Aún no has registrado tu local. <Link to="/merchant/commerce/new" className="text-yellow-700 underline">Crear comercio ahora</Link>
          </div>
        )}
        {commerce && (
          <div className="mb-4 p-4 bg-white rounded shadow text-sm flex flex-col gap-1">
            <div className="font-semibold">{commerce.name}</div>
            <div className="text-gray-600">{commerce.address}</div>
            {commerce.category && <div className="text-gray-500">Categoría: {commerce.category}</div>}
          </div>
        )}
        <div className="flex gap-4">
          <MetricCard title="Vistas" value={metrics.views} />
          <MetricCard title="Canjes" value={metrics.redemptions} />
          <MetricCard title="Promos activas" value={metrics.activePromos} />
        </div>
      </div>
    </div>
  )
}

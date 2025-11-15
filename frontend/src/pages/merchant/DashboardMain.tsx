import React, { useEffect, useState } from 'react'
import MerchantNavbar from '../../components/MerchantNavbar'
import MetricCard from '../../components/MetricCard'
import axios from 'axios'

export default function DashboardMain() {
  const [metrics, setMetrics] = useState<{ views: number; redemptions: number; activePromos: number }>({ views: 0, redemptions: 0, activePromos: 0 })

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

  return (
    <div>
      <MerchantNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        <div className="flex gap-4">
          <MetricCard title="Vistas" value={metrics.views} />
          <MetricCard title="Canjes" value={metrics.redemptions} />
          <MetricCard title="Promos activas" value={metrics.activePromos} />
        </div>
      </div>
    </div>
  )
}

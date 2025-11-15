import React, { useEffect, useState } from 'react'
import PromotionCard from '../components/PromotionCard'
import Filters from '../components/Filters'
import { getAllPromotions } from '../services/api'
import type { Promotion } from '../types'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [category, setCategory] = useState<string | null>(null)

  useEffect(() => {
    getAllPromotions().then((data) => setPromotions(data || []))
  }, [])

  const categories = Array.from(new Set(promotions.map((p) => (p as any).category).filter(Boolean)))

  const filtered = category ? promotions.filter((p) => ((p as any).category) === category) : promotions

  return (
    <div className="p-4">
      <div className="mb-3">
        <Filters categories={categories} selected={category} onChange={setCategory} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="p-2">
            <Link to={`/promotions/${p.id}`}>
              <PromotionCard promotion={p} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

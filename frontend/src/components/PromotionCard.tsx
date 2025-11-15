import React from 'react'
import type { Promotion } from '../types'
import { Link } from 'react-router-dom'

type Props = {
  promotion: Promotion
}

export function PromotionCard({ promotion }: Props) {
  return (
    <div className="w-72 bg-white rounded shadow p-3">
      <div className="flex items-center gap-3">
        <img src={promotion.imageUrl || '/placeholder.png'} alt={promotion.title} className="w-16 h-16 object-cover rounded" />
        <div>
          <h3 className="font-semibold">{promotion.title}</h3>
          <p className="text-sm text-gray-600">{promotion.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">{promotion.discountType} {promotion.discountValue ? `- ${promotion.discountValue}` : ''}</div>
        <Link to={`/promotions/${promotion.id}`} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">Ver promoción</Link>
      </div>
    </div>
  )
}

export default PromotionCard

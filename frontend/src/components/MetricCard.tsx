import React from 'react'

type Props = { title: string; value: string | number }

export function MetricCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded shadow p-4 w-48">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

export default MetricCard

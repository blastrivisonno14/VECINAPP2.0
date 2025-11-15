import React from 'react'

type Props = {
  categories: string[]
  selected: string | null
  onChange: (c: string | null) => void
}

export function Filters({ categories, selected, onChange }: Props) {
  return (
    <div className="p-2 bg-white rounded shadow flex gap-2 items-center">
      <label className="text-sm">Categoría:</label>
      <select value={selected ?? ''} onChange={(e) => onChange(e.target.value || null)} className="border px-2 py-1 rounded">
        <option value="">Todas</option>
        {categories.map((c) => (
          <option value={c} key={c}>{c}</option>
        ))}
      </select>
      <button className="ml-auto text-sm text-gray-600" onClick={() => onChange(null)}>Borrar</button>
    </div>
  )
}

export default Filters

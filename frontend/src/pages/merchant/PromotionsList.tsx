import React, { useEffect, useState } from 'react'
import MerchantNavbar from '../../components/MerchantNavbar'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function PromotionsList() {
  const [promotions, setPromotions] = useState<any[]>([])

  useEffect(() => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.get(`${BACKEND}/promotions`).then((r) => setPromotions(r.data || []))
  }, [])

  const remove = async (id: number) => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    await axios.patch(`${BACKEND}/promotions/${id}`, { isActive: false })
    setPromotions((p) => p.filter((x) => x.id !== id))
  }

  return (
    <div>
      <MerchantNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Mis promociones</h1>
        <div className="mb-4"><Link to="/merchant/promotions/new" className="px-3 py-2 bg-blue-600 text-white rounded">Crear promoción</Link></div>
        <div className="grid grid-cols-1 gap-3">
          {promotions.map((p) => (
            <div key={p.id} className="p-3 bg-white rounded shadow flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/merchant/promotions/${p.id}/edit`} className="px-2 py-1 bg-yellow-400 rounded">Editar</Link>
                <button onClick={() => remove(p.id)} className="px-2 py-1 bg-red-500 text-white rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

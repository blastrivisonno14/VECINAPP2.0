import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { createCoupon as apiCreateCoupon } from '../services/api'

export default function PromotionDetail() {
  const { id } = useParams()
  const [promo, setPromo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    if (!id) return
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.get(`${BACKEND}/promotions/${id}`).then((r) => setPromo(r.data))
  }, [id])

  const createCoupon = async () => {
    if (!token) return alert('Inicia sesión para crear un cupón')
    setLoading(true)
    try {
      const res = await apiCreateCoupon(token, Number(id))
      alert('Cupón creado')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error')
    } finally { setLoading(false) }
  }

  if (!promo) return <div className="p-4">Cargando promoción...</div>

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-4">
        <img src={promo.imageUrl || '/placeholder.png'} alt={promo.title} className="w-full h-48 object-cover rounded mb-3" />
        <h1 className="text-xl font-bold mb-2">{promo.title}</h1>
        <p className="text-sm text-gray-700 mb-3">{promo.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{promo.discountType} {promo.discountValue ? `- ${promo.discountValue}` : ''}</div>
          <button onClick={createCoupon} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Creando...' : 'Crear cupón'}</button>
        </div>
      </div>
    </div>
  )
}

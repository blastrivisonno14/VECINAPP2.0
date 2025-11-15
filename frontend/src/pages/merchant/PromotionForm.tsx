import React, { useEffect, useState } from 'react'
import MerchantNavbar from '../../components/MerchantNavbar'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

export default function PromotionForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState<any>({ title: '', description: '', discountType: 'percent', discountValue: 0, lat: 0, lng: 0 })

  useEffect(() => {
    if (id) {
      const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
      axios.get(`${BACKEND}/promotions/${id}`).then((r) => setForm(r.data))
    }
  }, [id])

  const save = async () => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    if (id) {
      await axios.patch(`${BACKEND}/promotions/${id}`, form)
    } else {
      await axios.post(`${BACKEND}/promotions`, form)
    }
    nav('/merchant/promotions')
  }

  return (
    <div>
      <MerchantNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">{id ? 'Editar' : 'Crear'} promoción</h1>
        <div className="grid grid-cols-1 gap-3 max-w-md">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="p-2 border rounded" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción" className="p-2 border rounded" />
          <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} placeholder="Valor descuento" className="p-2 border rounded" />
          <div className="flex gap-2">
            <input type="number" value={form.lat} onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })} placeholder="Lat" className="p-2 border rounded w-full" />
            <input type="number" value={form.lng} onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })} placeholder="Lng" className="p-2 border rounded w-full" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded">Guardar</button>
            <button onClick={() => nav(-1)} className="px-3 py-2 bg-gray-200 rounded">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

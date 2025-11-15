import { FormEvent, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as api from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function CommerceForm() {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | ''>('')
  const [lng, setLng] = useState<number | ''>('')
  const [category, setCategory] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [created, setCreated] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const autofillLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(Number(pos.coords.latitude.toFixed(6)))
      setLng(Number(pos.coords.longitude.toFixed(6)))
    })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const payload: any = { name, address, category, logoUrl }
      if (lat !== '') payload.lat = lat
      if (lng !== '') payload.lng = lng
      const c = await api.createCommerce(token, payload)
      setCreated(c)
      showToast('Comercio creado correctamente', 'success')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error creando comercio')
      showToast(err?.response?.data?.error || 'Error creando comercio', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-xl mx-auto card space-y-4'>
      <h1 className='text-xl font-semibold'>Registrar Comercio</h1>
      {error && <div className='text-red-600 text-sm'>{error}</div>}
      {created && <div className='p-3 bg-green-100 text-green-700 text-sm rounded'>Comercio creado correctamente: {created.name}</div>}
      <form onSubmit={onSubmit} className='space-y-4'>
        <div className='grid gap-3 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <label className='label'>Nombre</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className='input' />
          </div>
          <div className='flex flex-col gap-1 md:col-span-2'>
            <label className='label'>Dirección</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} required className='input' />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='label'>Latitud</label>
            <input value={lat} onChange={e=>setLat(e.target.value === '' ? '' : Number(e.target.value))} className='input' />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='label'>Longitud</label>
            <input value={lng} onChange={e=>setLng(e.target.value === '' ? '' : Number(e.target.value))} className='input' />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='label'>Categoría</label>
            <input value={category} onChange={e=>setCategory(e.target.value)} className='input' />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='label'>Logo URL</label>
            <input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} className='input' />
          </div>
        </div>
        <div className='flex gap-2'>
          <button type='button' onClick={autofillLocation} className='btn btn-secondary text-xs'>Usar mi ubicación</button>
          <button type='submit' disabled={loading} className='btn btn-primary'>
            {loading ? 'Guardando...' : 'Crear comercio'}
          </button>
        </div>
      </form>
    </div>
  )
}

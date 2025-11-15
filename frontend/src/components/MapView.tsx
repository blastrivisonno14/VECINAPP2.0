import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Spinner from './Spinner'
import type { Promotion } from '../types'
import * as api from '../services/api'
import PromotionCard from './PromotionCard'
import Filters from './Filters'

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 14)
  }, [lat, lng])
  return null
}

export function MapView() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [commerces, setCommerces] = useState<any[]>([])
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<string | null>(null)

  useEffect(() => {
    // get user location
    if (!center) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCenter({ lat: -34.6037, lng: -58.3816 }) // fallback to Buenos Aires
      )
    }
  }, [])

  useEffect(() => {
    if (!center) return
    setLoading(true)
    Promise.all([
      api.getNearbyPromotions(center.lat, center.lng).catch(()=>[]),
      api.listCommerces().catch(()=>[])
    ]).then(([promos, comms]) => {
      setPromotions(promos.filter((p: any) => p.isActive))
      setCommerces(comms.filter((c: any) => c.lat && c.lng))
    }).finally(() => setLoading(false))
  }, [center])

  const categories = useMemo(() => {
    const s = new Set<string>()
    promotions.forEach((p) => { if (p && (p as any).category) s.add((p as any).category) })
    return Array.from(s)
  }, [promotions])

  const filtered = useMemo(() => {
    if (!category) return promotions
    return promotions.filter((p) => ((p as any).category) === category)
  }, [promotions, category])

  if (!center) return <div className='flex items-center justify-center h-64'><Spinner /></div>

  return (
    <div className="h-[70vh] w-full relative">
      <div className="mb-2">
        <Filters categories={categories} selected={category} onChange={setCategory} />
      </div>
      {loading && (
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 backdrop-blur-sm'>
          <Spinner size={48} />
          <p className='mt-2 text-sm text-gray-700'>Cargando datos cercanos...</p>
        </div>
      )}
      <MapContainer center={[center.lat, center.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter lat={center.lat} lng={center.lng} />
        {filtered.map((p) => (
          p.lat && p.lng ? (
            <Marker key={`promo-${p.id}`} position={[p.lat, p.lng]}>
              <Popup>
                <PromotionCard promotion={p} />
              </Popup>
            </Marker>
          ) : null
        ))}
        {commerces.map(c => (
          <Marker key={`comm-${c.id}`} position={[c.lat, c.lng]}>
            <Popup>
              <div className='text-sm'>
                <div className='font-semibold'>{c.name}</div>
                <div className='text-xs text-gray-600'>{c.address}</div>
                {c.category && <div className='text-xs mt-1'>Categoría: {c.category}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView

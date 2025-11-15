import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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
    api.getNearbyPromotions(center.lat, center.lng).then((data) => {
      setPromotions(data.filter((p) => p.isActive))
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

  if (!center) return <div>Obteniendo ubicación...</div>

  return (
    <div className="h-[70vh] w-full">
      <div className="mb-2">
        <Filters categories={categories} selected={category} onChange={setCategory} />
      </div>
      <MapContainer center={[center.lat, center.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter lat={center.lat} lng={center.lng} />
        {filtered.map((p) => (
          p.lat && p.lng ? (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <PromotionCard promotion={p} />
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView

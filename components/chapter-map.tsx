"use client"

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

type Chapter = {
  id: string
  name: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
}

export function ChapterMap({ chapters }: { chapters: Chapter[] }) {
  const usable = chapters.filter((x) => x.latitude != null && x.longitude != null)
  useEffect(() => {}, [])
  return (
    <div className="h-[430px] overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={[20, 30]} zoom={2} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {usable.map((chapter) => (
          <Marker key={chapter.id} position={[chapter.latitude!, chapter.longitude!]} icon={icon}>
            <Popup><strong>{chapter.name}</strong><br />{chapter.city}, {chapter.country}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

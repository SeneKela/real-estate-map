"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { properties } from "@/lib/data"
import { Property } from "@/types/property"

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: "/marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: "/marker-shadow.svg",
  shadowSize: [32, 32],
  shadowAnchor: [16, 32],
})

// Custom marker component with hover effect
function CustomMarker({ property, isSelected, onClick }: { property: Property; isSelected: boolean; onClick: () => void }) {
  const markerRef = useRef<L.Marker>(null)
  const map = useMap()

  useEffect(() => {
    if (isSelected && markerRef.current) {
      map.setView(markerRef.current.getLatLng(), 15)
    }
  }, [isSelected, map])

  return (
    <Marker
      ref={markerRef}
      position={[property.latitude, property.longitude]}
      icon={icon}
      eventHandlers={{
        click: onClick,
        mouseover: (e) => {
          const marker = e.target
          marker.setIcon(L.divIcon({
            className: 'custom-marker',
            html: `<div class="bg-primary text-white px-2 py-1 rounded-md shadow-lg text-sm whitespace-nowrap">${property.nom}</div>`,
            iconSize: [100, 30],
            iconAnchor: [50, 30],
          }))
        },
        mouseout: (e) => {
          const marker = e.target
          marker.setIcon(icon)
        }
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-medium">{property.nom}</h3>
          <p className="text-sm text-gray-600">{property.adresse}</p>
        </div>
      </Popup>
    </Marker>
  )
}

// Map component
export function Map({ selectedProperty, onPropertySelect }: { selectedProperty: Property | null; onPropertySelect: (property: Property) => void }) {
  const [center, setCenter] = useState<[number, number]>([46.603354, 1.888334]) // Center of France
  const mapRef = useRef<L.Map>(null)

  // Cast properties to Property[] type
  const typedProperties = properties as Property[]

  useEffect(() => {
    if (selectedProperty && mapRef.current) {
      mapRef.current.setView([selectedProperty.latitude, selectedProperty.longitude], 15)
    }
  }, [selectedProperty])

  return (
    <div className="h-full w-full">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={6}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {typedProperties.map((property) => (
          <CustomMarker
            key={property.id}
            property={property}
            isSelected={selectedProperty?.id === property.id}
            onClick={() => onPropertySelect(property)}
          />
        ))}
      </MapContainer>
      <style jsx global>{`
        .custom-marker {
          background: none;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  )
} 
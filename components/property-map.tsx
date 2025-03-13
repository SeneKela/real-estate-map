"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Building, FileText, Phone, Users, Briefcase, Wrench, MoreHorizontal, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { properties } from "@/lib/data"
import { PropertyDetail } from "@/components/property-detail"
import { formatNumber } from "@/lib/utils"
import type { Map, Marker } from "leaflet"

interface Property {
  id: number
  nom: string
  adresse: string
  ville: string
  departement: string
  region: string
  valeur: number
  superficie: number
  type: string
  status: "actif" | "renovation" | "historique"
  ministere: string
  niveauSecurite: "faible" | "moyen" | "élevé"
  telephone?: string
  tauxOccupation: number
  occupationActuelle: number
  capaciteMax: number
  latitude: number
  longitude: number
  image?: string
  description: string
  installations: string[]
  bails: any[]
  projets: any[]
  taches: any[]
}

// Type assertion for properties data
const typedProperties = properties as Property[]

export default function PropertyMap() {
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [leaflet, setLeaflet] = useState<any>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Function to update search input
  const updateSearchWithProperty = (property: Property) => {
    // Find the PropertySearch component and call its updateSearch method
    const searchComponent = document.querySelector('[data-search-component]')
    if (searchComponent) {
      const event = new CustomEvent('updateSearch', { 
        detail: { term: property.nom },
        bubbles: true 
      })
      searchComponent.dispatchEvent(event)
    }
  }

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Separate useEffect for Leaflet initialization
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return

    const initializeLeaflet = async () => {
      try {
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const linkEl = document.createElement("link")
          linkEl.rel = "stylesheet"
          linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          linkEl.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          linkEl.crossOrigin = ""
          document.head.appendChild(linkEl)
        }

        // Import Leaflet JS
        const L = await import("leaflet")
        setLeaflet(L)

        if (!mapRef.current || map) return

        // Create map centered on France
        const mapInstance = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView([46.8566, 2.3522], 5)

        // Add modern tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(mapInstance)

        // Add zoom control to top right
        L.control.zoom({
          position: "topright",
        }).addTo(mapInstance)

        // Add custom attribution to bottom right
        L.control.attribution({
          position: "bottomright",
          prefix: false,
        }).addTo(mapInstance)

        // Add markers for each property
        const newMarkers = typedProperties.map((property: Property) => {
          // Determine marker color based on property status
          let markerColor = "#000091" // Default color
          if (property.status === "renovation") markerColor = "#E1000F"
          if (property.status === "historique") markerColor = "#6A6A6A"

          // Create custom icon with color and shadow
          const icon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                background-color: ${markerColor};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: all 0.2s ease;
              "></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          // Create marker with hover effect
          const marker = L.marker([property.latitude, property.longitude], { icon })
            .addTo(mapInstance)
            .on("click", () => {
              updateSearchWithProperty(property)
            })
            .on("mouseover", (e: { target: { getElement: () => HTMLElement } }) => {
              const markerElement = e.target.getElement()
              if (markerElement) {
                const markerDiv = markerElement.querySelector('div')
                if (markerDiv) {
                  markerDiv.style.transform = "scale(1.2)"
                  markerDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)"
                }
              }
            })
            .on("mouseout", (e: { target: { getElement: () => HTMLElement } }) => {
              const markerElement = e.target.getElement()
              if (markerElement) {
                const markerDiv = markerElement.querySelector('div')
                if (markerDiv) {
                  markerDiv.style.transform = "scale(1)"
                  markerDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
                }
              }
            })

          return marker
        })

        setMap(mapInstance)
        setMarkers(newMarkers)
      } catch (error) {
        console.error("Error initializing Leaflet:", error)
      }
    }

    initializeLeaflet()

    return () => {
      if (map) {
        map.remove()
        setMap(null)
      }
      markers.forEach(marker => marker.remove())
      setMarkers([])
    }
  }, [mounted, map])

  const getStatusBadge = (status: Property["status"]) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-emerald-500 text-white font-medium rounded-full px-2.5 py-0.5 text-xs">Actif</Badge>
      case "renovation":
        return <Badge className="bg-amber-500 text-white font-medium rounded-full px-2.5 py-0.5 text-xs">En Rénovation</Badge>
      case "historique":
        return <Badge className="bg-indigo-600 text-white font-medium rounded-full px-2.5 py-0.5 text-xs">Monument Historique</Badge>
      default:
        return <Badge className="bg-gray-500 text-white font-medium rounded-full px-2.5 py-0.5 text-xs">Inconnu</Badge>
    }
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
  }

  const handleViewDetail = (property: Property) => {
    setSelectedProperty(property)
    setShowDetail(true)
  }

  const CustomMarker = ({ property }: { property: Property }) => {
    const markerRef = useRef<L.Marker | null>(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
      if (!map || !leaflet) return

      const marker = leaflet.marker([property.latitude, property.longitude], {
        icon: leaflet.divIcon({
          className: "custom-marker",
          html: `
            <div class="marker-content ${isHovered ? 'hovered' : ''}">
              <div class="marker-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div class="marker-label">${property.nom}</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        }),
      })

      marker.on("click", () => {
        updateSearchWithProperty(property)
      })

      marker.on("mouseover", () => {
        setIsHovered(true)
        marker.setIcon(
          leaflet.divIcon({
            className: "custom-marker",
            html: `
              <div class="marker-content hovered">
                <div class="marker-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div class="marker-label">${property.nom}</div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          })
        )
      })

      marker.on("mouseout", () => {
        setIsHovered(false)
        marker.setIcon(
          leaflet.divIcon({
            className: "custom-marker",
            html: `
              <div class="marker-content">
                <div class="marker-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div class="marker-label">${property.nom}</div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          })
        )
      })

      markerRef.current = marker
      marker.addTo(map)

      return () => {
        if (markerRef.current) {
          map.removeLayer(markerRef.current)
        }
      }
    }, [map, leaflet, property, isHovered])

    return null
  }

  if (!mounted) {
    return <div className="w-full h-full bg-muted animate-pulse" />
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full z-0" />

      {selectedProperty && showDetail && <PropertyDetail property={selectedProperty} onClose={handleCloseDetail} />}
    </div>
  )
}


"use client"

import { MapPin, Building, FileText, Phone, Users, Briefcase, Wrench, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

interface Bail {
  actif?: boolean
  reference?: string
  locataire?: string
  surface?: number
  loyer?: number
  dateDebut?: string
  dateFin?: string
  leaseId?: string
  title?: string
  status?: "actif" | "inactif" | "Propriété Gouvernementale"
  general?: {
    leaseDetails?: {
      type?: string
      primaryUse?: string
      baseYear?: string
    }
    financialDetails?: {
      rent?: string
      accountingType?: string
      paymentTerms?: string
    }
  }
  dates?: {
    start?: string
    duration?: string
    end?: string
  }
  parties?: {
    tenant?: {
      organization?: string
      legalName?: string
      id?: string
      location?: string
    }
  }
  terms?: {
    securityRequirements?: string[]
  }
  metadata?: {
    lastUpdated?: string
  }
}

interface Projet {
  nom: string
  responsable: string
  budget: number
  dateDebut: string
  dateFin: string
  avancement: number
  description: string
  actif: boolean
}

interface Tache {
  titre: string
  description: string
  priorite: "haute" | "moyenne" | "basse"
  assigneA: string
  echeance: string
  statut: string
  categorie: string
}

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
  bails: Bail[]
  projets: Projet[]
  taches: Tache[]
}

interface PropertyCardProps {
  property: Property
  onClick?: (property: Property) => void
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
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

  // Count active items
  const activeLeases = property.bails?.filter((bail: Bail) => bail.actif).length || 0
  const activeProjects = property.projets?.filter((projet: Projet) => projet.actif).length || 0
  const openTasks = property.taches?.length || 0

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 rounded-xl"
      onClick={() => onClick && onClick(property)}
    >
      <div className="relative h-[120px] group">
        <img
          src={property.image || "/api/placeholder/500/300"}
          alt={property.nom}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        <div className="absolute top-3 left-3">{getStatusBadge(property.status)}</div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-lg text-white mb-1 drop-shadow-sm">{property.nom}</h3>
          <p className="text-sm text-white/90 flex items-center drop-shadow-sm">
            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">{property.adresse}</span>
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
            <span className="text-sm font-semibold text-gray-800">{formatNumber(property.superficie)} m²</span>
          </div>
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <Building className="h-4 w-4 mr-2 text-gray-500" />
            <span className="truncate">{property.type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            <span className="truncate">{property.ministere}</span>
          </div>
          {property.telephone && (
            <div className="flex items-center text-sm text-gray-700">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span className="truncate">{property.telephone}</span>
            </div>
          )}
          {property.tauxOccupation !== undefined && (
            <div className="flex items-center text-sm text-gray-700">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span className="truncate">{property.tauxOccupation}% occupé</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {activeLeases > 0 && (
            <Badge variant="outline" className="rounded-full text-xs py-1 px-3 border-gray-300 text-gray-700 flex items-center">
              <Briefcase className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              {activeLeases} {activeLeases > 2 ? "Baux" : activeLeases > 1 ? "Bails" : "Bail"} actif{activeLeases > 1 ? "s" : ""}
            </Badge>
          )}
          {activeProjects > 0 && (
            <Badge variant="outline" className="rounded-full text-xs py-1 px-3 border-gray-300 text-gray-700 flex items-center">
              <Wrench className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              {activeProjects} Projet{activeProjects > 1 ? "s" : ""} actif{activeProjects > 1 ? "s" : ""}
            </Badge>
          )}
          {openTasks > 0 && (
            <Badge variant="secondary" className="rounded-full text-xs py-1 px-3 bg-gray-100 text-gray-800 flex items-center">
              {openTasks} Tâche{openTasks > 1 ? "s" : ""} ouverte{openTasks > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


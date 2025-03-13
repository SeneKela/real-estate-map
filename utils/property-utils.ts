import { Property, NewsItem } from "@/types/property"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Building,
  FileText,
  Shield,
  Phone,
  Maximize,
  Users,
  BookOpen,
  Coffee,
  Newspaper,
  Wifi,
  Utensils,
  ParkingMeterIcon as Parking,
  Landmark,
  Headphones,
  Leaf,
  Plane,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  }
  return new Date(dateString).toLocaleDateString("fr-FR", options)
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price)
}

export const getStatusBadgeConfig = (status: Property["status"]) => {
  switch (status) {
    case "actif":
      return {
        className: "bg-emerald-500 text-white font-medium rounded-full px-2.5 py-0.5 text-xs",
        icon: Check,
        text: "Actif"
      }
    case "renovation":
      return {
        className: "bg-amber-500 text-white font-medium rounded-full px-2.5 py-0.5 text-xs",
        icon: Clock,
        text: "En Rénovation"
      }
    case "historique":
      return {
        className: "bg-indigo-600 text-white font-medium rounded-full px-2.5 py-0.5 text-xs",
        icon: Landmark,
        text: "Monument Historique"
      }
    default:
      return {
        className: "bg-gray-500 text-white font-medium rounded-full px-2.5 py-0.5 text-xs",
        icon: Building,
        text: "Inconnu"
      }
  }
}

export const getSecurityBadgeConfig = (level: Property["niveauSecurite"]) => {
  switch (level) {
    case "faible":
      return {
        className: "border-emerald-500 text-emerald-500 rounded-full px-2.5 py-0.5 text-xs",
        text: "Sécurité Faible"
      }
    case "moyen":
      return {
        className: "border-amber-500 text-amber-500 rounded-full px-2.5 py-0.5 text-xs",
        icon: AlertTriangle,
        text: "Sécurité Moyenne"
      }
    case "élevé":
      return {
        className: "border-rose-500 text-rose-500 rounded-full px-2.5 py-0.5 text-xs",
        icon: Shield,
        text: "Sécurité Élevée"
      }
    default:
      return null
  }
}

export function getInstallationIcon(installation: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    "Wi-Fi": Wifi,
    "Cafétéria": Utensils,
    "Parking": Parking,
    "Salle de réunion": Users,
    "Bibliothèque": BookOpen,
    "Café": Coffee,
    "Centre d'affaires": Landmark,
    "Service client": Headphones,
    "Jardin": Leaf,
    "Aéroport": Plane,
  }

  return iconMap[installation] || Building
} 
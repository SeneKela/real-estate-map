"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Draggable from "react-draggable"
import type { DraggableEvent, DraggableData } from "react-draggable"
import type { LucideIcon } from "lucide-react"
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
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Calendar,
  Wifi,
  Utensils,
  ParkingMeterIcon as Parking,
  Landmark,
  Headphones,
  Leaf,
  Plane,
  X,
  CheckCircle2,
  AlertCircle,
  Clock8,
  BarChart4,
  Info,
  ExternalLink,
  Layers,
  Briefcase,
  Wrench,
  AlertTriangle,
  CircleDot,
  Clock,
  Hash,
  User,
  Building2,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  FileCheck,
  Banknote,
  SquareUser,
  Pencil,
  Printer,
  School,
  Droplet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { palaceProject, type Project } from "@/lib/data"
import { news } from "../data/news-data"
import type { NewsItem } from "@/types/property"

interface Bail {
  actif?: boolean
  reference?: string
  locataire?: string
  surface?: number
  loyer?: number
  dateDebut?: string
  dateFin?: string
  type?: string
  leaseId?: string
  title?: string
  status?: "actif" | "inactif" | "Propriété Gouvernementale"
  tauxOccupation?: number
  occupationActuelle?: number
  capaciteMax?: number
  sous_bails?: {
    reference: string
    locataire: string
    surface: number
    loyer: number
    dateDebut: string
    dateFin: string
    actif: boolean
    type: string
    tauxOccupation: number
    occupationActuelle: number
    capaciteMax: number
    description: string
    installations: string[]
  }[]
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

interface PropertyDetailProps {
  property: Property
  onClose: () => void
}

interface StatusBadgeConfig {
  className: string
  text: string
  icon: LucideIcon
}

interface SecurityBadgeConfig {
  className: string
  text: string
  icon: LucideIcon
}

interface PriorityConfig {
  className: string
  icon: LucideIcon
}

interface Sublease {
  type: string;
  tenant?: string;
  locataire?: string;
  rent?: string;
  loyer?: number;
  area?: number;
  surface?: number;
  startDate?: string;
  endDate?: string;
  dateDebut?: string;
  dateFin?: string;
  status?: string;
  actif?: boolean;
  occupancyRate?: number;
  tauxOccupation?: number;
  description?: string;
}

// Fonctions utilitaires
const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Non spécifié"
  
  // Si le format est déjà JJ/MM/AAAA, on le retourne tel quel
  if (dateString.includes("/")) {
    return dateString
  }

  try {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Date invalide"
    }
    return date.toLocaleDateString("fr-FR", options)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date invalide"
  }
}

const formatPrice = (price: number | string | undefined | null): string => {
  if (!price) return "Non spécifié"
  
  // Si c'est déjà une chaîne formatée avec devise
  if (typeof price === "string" && price.includes("€")) {
    return price
  }

  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Number(price))
  } catch (error) {
    console.error("Error formatting price:", error)
    return "Montant invalide"
  }
}

const getStatusBadgeConfig = (status: Property["status"] | "Propriété Gouvernementale" | "actif" | "inactif"): StatusBadgeConfig => {
  switch (status) {
    case "actif":
      return {
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
        text: "Actif",
        icon: CheckCircle2,
      }
    case "renovation":
      return {
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0",
        text: "En Rénovation",
        icon: Wrench,
      }
    case "historique":
      return {
        className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-0",
        text: "Monument Historique",
        icon: Landmark,
      }
    case "Propriété Gouvernementale":
      return {
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0",
        text: "Propriété Gouvernementale",
        icon: Building2,
      }
    case "inactif":
      return {
        className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0",
        text: "Inactif",
        icon: CircleDot,
      }
    default:
      return {
        className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0",
        text: status || "Inconnu",
        icon: CircleDot,
      }
  }
}

const getSecurityBadgeConfig = (level: Property["niveauSecurite"]): SecurityBadgeConfig | null => {
  switch (level) {
    case "faible":
      return {
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        text: "Sécurité Faible",
        icon: Shield,
      }
    case "moyen":
      return {
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
        text: "Sécurité Moyenne",
        icon: Shield,
      }
    case "élevé":
      return {
        className:
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
        text: "Sécurité Élevée",
        icon: Shield,
      }
    default:
      return null
  }
}

const getInstallationIcon = (installation: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    "Salle de réception": Users,
    "Bureaux présidentiels": Building,
    "Bureaux administratifs": Building,
    Jardins: Leaf,
    Héliport: Plane,
    "Salle de conférence": Users,
    "Centre de communication sécurisé": Headphones,
    "Salle du Conseil": Users,
    "Centre de presse": Newspaper,
    "Salles de réunion": Users,
    "Centre de conférences": Users,
    "Restaurant administratif": Utensils,
    Bibliothèque: BookOpen,
    "Centre de documentation": FileText,
    "Parking souterrain": Parking,
    Amphithéâtres: Landmark,
    Cafétéria: Coffee,
    "Espaces étudiants": School,
    "Galeries d'exposition": Landmark,
    Fontaines: Droplet,
    Boutiques: Building,
    Restaurants: Utensils,
    "WiFi haute performance": Wifi,
  }

  return iconMap[installation] || Building
}

const getProgressColor = (value: number): string => {
  return "bg-gray-200"
}

const getPriorityConfig = (priority: Tache["priorite"]): PriorityConfig => {
  switch (priority) {
    case "haute":
      return {
        className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-0",
        icon: AlertTriangle,
      }
    case "moyenne":
      return {
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0",
        icon: AlertCircle,
      }
    case "basse":
      return {
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
        icon: Info,
      }
    default:
      return {
        className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0",
        icon: Info,
      }
  }
}

// Ajoutez cette fonction utilitaire avant la fonction PropertyDetail
const getRelatedProjectDetails = (propertyId: number): Project | null => {
  // Pour l'instant, nous associons simplement le palaceProject au Palais de l'Élysée (id: 1)
  if (propertyId === 1) {
    return palaceProject
  }
  return null
}

// Fix type checking for bail properties
const isNewFormat = (bail: Bail): boolean => {
  return 'leaseId' in bail && bail.leaseId !== undefined
}

const getBailTitle = (bail: Bail): string => {
  if (isNewFormat(bail)) {
    return bail.title || `Bail ${bail.leaseId}`
  }
  return `Bail ${bail.reference}`
}

const getBailStatus = (bail: Bail): "actif" | "inactif" | "Propriété Gouvernementale" => {
  if (isNewFormat(bail)) {
    return bail.status || "inactif"
  }
  return bail.actif ? "actif" : "inactif"
}

const getBailTenant = (bail: Bail): string => {
  if (isNewFormat(bail)) {
    return bail.parties?.tenant?.organization || 
           bail.parties?.tenant?.legalName || 
           "Non spécifié"
  }
  return bail.locataire || "Non spécifié"
}

export function PropertyDetail({ property, onClose }: PropertyDetailProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  // Handle scroll for header minimization
  useEffect(() => {
    if (!mounted || !contentRef.current) return

    const handleScroll = () => {
      const scrollTop = contentRef.current?.scrollTop || 0
      setIsHeaderMinimized(scrollTop > 100)
    }

    contentRef.current.addEventListener('scroll', handleScroll)
    return () => {
      contentRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [mounted, setIsHeaderMinimized])

  // Handle escape key to close modal
  useEffect(() => {
    if (!mounted) return

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [mounted])

  const handleDragStart = () => {
    if (!mounted) return
    setIsDragging(true)
  }

  const handleDragStop = () => {
    if (!mounted) return
    setIsDragging(false)
  }

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (!mounted) return
    setPosition({ x: data.x, y: data.y })
  }

  const nextNews = () => {
    if (!mounted) return
    setCurrentNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1))
  }

  const prevNews = () => {
    if (!mounted) return
    setCurrentNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))
  }

  const handleClose = () => {
    if (!mounted) return
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  // Don't render anything until mounted
  if (!mounted) {
    return null
  }

  const statusBadgeConfig = getStatusBadgeConfig(property.status)
  const securityBadgeConfig = getSecurityBadgeConfig(property.niveauSecurite)

  // Calculer les statistiques
  const activeLeases = property.bails?.filter((bail) => {
    if ('leaseId' in bail) {
      return bail.status === "actif" || bail.status === "Propriété Gouvernementale"
    }
    return bail.actif
  }).length || 0
  const activeProjects = property.projets?.filter((projet) => projet.actif).length || 0
  const openTasks = property.taches?.length || 0
  const highPriorityTasks = property.taches?.filter((tache) => tache.priorite === "haute").length || 0

  // Dans la fonction principale PropertyDetail, ajoutez cette ligne juste après la définition des statistiques
  const detailedProject = getRelatedProjectDetails(property.id)

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        />
        <Draggable
          key="modal"
          handle=".drag-handle"
          bounds="parent"
          position={position}
          onDrag={handleDrag}
          onStart={handleDragStart}
          onStop={handleDragStop}
          defaultPosition={{ x: 0, y: 0 }}
          nodeRef={nodeRef}
          disabled={isClosing || isDragging}
          grid={[1, 1]}
        >
          <motion.div
            ref={nodeRef}
            className="fixed z-50"
            style={{
              width: "95%",
              maxWidth: "90rem",
              top: "2%",
              left: "2.5%",
              transform: "translate3d(0, 0, 0)",
              willChange: "transform",
            }}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{
              scale: isClosing ? 0.95 : 1,
              opacity: isClosing ? 0 : 1,
              y: isClosing ? 10 : position.y,
              x: position.x,
            }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{
              duration: 0.2,
              type: "spring",
              bounce: 0.1,
              x: { type: "spring", stiffness: 300, damping: 30 },
              y: { type: "spring", stiffness: 300, damping: 30 },
            }}
          >
            <Card className="overflow-hidden border shadow-xl rounded-xl bg-white dark:bg-gray-950">
              {/* Header avec image de fond et informations principales */}
              <div 
                className={cn(
                  "relative bg-gradient-to-r from-gray-900 to-gray-800 drag-handle cursor-move select-none overflow-hidden transition-all duration-300",
                  "h-36" // Fixed height instead of dynamic
                )}
              >
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0 opacity-30">
                  <img
                    src={property.image || "/placeholder.svg?height=400&width=1200"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Contenu du header */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <Badge className={cn("px-2.5 py-1 text-xs font-medium", statusBadgeConfig.className)}>
                      {statusBadgeConfig.icon && <statusBadgeConfig.icon className="h-3.5 w-3.5 mr-1.5" />}
                      {statusBadgeConfig.text}
        </Badge>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="rounded-full h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Fermer</span>
                      </Button>
                    </div>
      </div>

                  <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-bold text-white">{property.nom}</h2>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[300px]">{property.adresse}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-5 divide-x border-b">
                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600 mb-2">
                    <Maximize className="h-5 w-5" />
              </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Superficie</p>
                    <p className="text-lg font-semibold">{property.superficie.toLocaleString()} m²</p>
              </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                    <p className="text-lg font-semibold">{property.tauxOccupation}%</p>
                  </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-50 text-amber-600 mb-2">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Baux actifs</p>
                    <p className="text-lg font-semibold">{activeLeases}</p>
                  </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-rose-50 text-rose-600 mb-2">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tâches urgentes</p>
                    <p className="text-lg font-semibold">{highPriorityTasks}</p>
                  </div>
                </div>

                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50 text-purple-600 mb-2">
                    <Clock8 className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total tâches</p>
                    <p className="text-lg font-semibold">{property.taches.length}</p>
                  </div>
                </div>
              </div>

              <div 
                ref={contentRef}
                className="overflow-auto flex-1 transition-all duration-300" 
                style={{ maxHeight: "calc(95vh - 250px)" }}
              >
                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b px-6 pt-6">
                    <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      <TabsTrigger
                        value="details"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Détails
                      </TabsTrigger>
                      <TabsTrigger
                        value="baux"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Baux
                      </TabsTrigger>
                      <TabsTrigger
                        value="projets"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50"
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        Projets
                      </TabsTrigger>
                      <TabsTrigger
                        value="taches"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50"
                      >
                        <Clock8 className="h-4 w-4 mr-2" />
                        Tâches
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="details" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Colonne de gauche avec description */}
                        <div className="space-y-6">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-medium flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                Description
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {property.description}
                              </p>
            </CardContent>
          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-medium flex items-center">
                                <Info className="h-4 w-4 mr-2 text-gray-500" />
                                Informations générales
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                                </div>
                                <span className="text-sm font-medium">{property.type}</span>
                              </div>

                              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Ministère</span>
                                </div>
                                <span className="text-sm font-medium">{property.ministere}</span>
                              </div>

                              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Téléphone</span>
                                </div>
                                <span className="text-sm font-medium">{property.telephone || "Non renseigné"}</span>
                              </div>

                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Niveau de sécurité</span>
                                </div>
                                {securityBadgeConfig && (
                                  <Badge variant="outline" className={securityBadgeConfig.className}>
                                    {securityBadgeConfig.text}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Colonne centrale et droite */}
                        <div className="md:col-span-2 space-y-6">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-medium flex items-center">
                                <BarChart4 className="h-4 w-4 mr-2 text-gray-500" />
                                Taux d'occupation
                              </CardTitle>
                            </CardHeader>
            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Occupation actuelle</span>
                                  <span className="text-sm font-medium">
                                    {property.occupationActuelle} / {property.capaciteMax}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Taux d'occupation:</span>
                                    <span className="font-medium">{property.tauxOccupation}%</span>
                                  </div>
                                  <Progress
                                    value={property.tauxOccupation}
                                    className={cn("h-2 bg-gray-100 dark:bg-gray-800", getProgressColor(property.tauxOccupation))}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-medium flex items-center">
                                <Layers className="h-4 w-4 mr-2 text-gray-500" />
                                Installations sur site
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {property.installations.map((installation, index) => {
                                  const Icon = getInstallationIcon(installation)
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                                        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                      </div>
                                      <span className="text-sm">{installation}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Google News-style carousel */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-medium flex items-center">
                                <Newspaper className="h-4 w-4 mr-2 text-gray-500" />
                                Actualités récentes
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="relative overflow-hidden">
                                <motion.div
                                  key={currentNewsIndex}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex flex-col md:flex-row gap-4 p-6"
                                >
                                  {/* News image */}
                                  <div className="w-full md:w-2/5">
                                    <div className="aspect-video overflow-hidden rounded-lg">
                                      <img
                                        src={news[currentNewsIndex].image || "/placeholder.svg"}
                                        alt={news[currentNewsIndex].title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>

                                  {/* News content */}
                                  <div className="w-full md:w-3/5 space-y-3">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Newspaper className="h-3 w-3 mr-1" />
                                        <span>{news[currentNewsIndex].source}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>{news[currentNewsIndex].date}</span>
                                      </div>
                                    </div>

                                    <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                      {news[currentNewsIndex].title}
                                    </h4>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {news[currentNewsIndex].summary}
                                    </p>

                                    <div className="flex justify-between items-center pt-2">
                                      <div className="flex space-x-1">
                                        {news.map((_, index) => (
                                          <div
                                            key={index}
                                            className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                                              index === currentNewsIndex
                                                ? "bg-blue-500"
                                                : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs flex items-center gap-1 rounded-full"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        Lire l'article
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm"
                                  onClick={prevNews}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                  <span className="sr-only">Précédent</span>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm"
                                  onClick={nextNews}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="sr-only">Suivant</span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="baux" className="mt-0 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-gray-500" />
                          Baux en cours
                        </h3>
                        <Badge className="rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {property.bails?.length || 0}
                        </Badge>
                      </div>
                      {property.bails?.length > 0 ? (
                        <div className="space-y-6">
                          {property.bails.map((bail, index) => {
                            const bailTitle = getBailTitle(bail)
                            const bailStatus = getBailStatus(bail)
                            const statusConfig = getStatusBadgeConfig(bailStatus)

                            return (
                              <Card key={index} className="overflow-hidden border-gray-200 dark:border-gray-800">
                                <CardHeader className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h3 className="text-base font-medium">{bailTitle}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          Occupant: {getBailTenant(bail)}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge className={statusConfig.className}>
                                      {statusConfig.icon && <statusConfig.icon className="h-3.5 w-3.5 mr-1.5" />}
                                      {statusConfig.text}
                                    </Badge>
                                  </div>
                                </CardHeader>

                                {/* Rest of the bail card content */}
                                <CardContent className="p-4 space-y-6">
                                  {/* Détails du bail */}
                                  {isNewFormat(bail) && bail.general?.leaseDetails && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <FileCheck className="h-4 w-4 mr-2 text-gray-500" />
                                        Détails du bail
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                                          <p className="text-sm font-medium">
                                            {bail.general.leaseDetails.type || "Non spécifié"}
                                          </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Usage principal
                                          </p>
                                          <p className="text-sm font-medium">
                                            {bail.general.leaseDetails.primaryUse || "Non spécifié"}
                                          </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Année de référence
                                          </p>
                                          <p className="text-sm font-medium">
                                            {bail.general.leaseDetails.baseYear || "Non spécifié"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Détails financiers */}
                                  {isNewFormat(bail) && bail.general?.financialDetails && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <Banknote className="h-4 w-4 mr-2 text-gray-500" />
                                        Détails financiers
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Loyer</p>
                                          <p className="text-sm font-medium">
                                            {isNewFormat(bail) 
                                              ? (bail.general?.financialDetails?.rent === "0" ? "Gratuit" : formatPrice(bail.general?.financialDetails?.rent || 0))
                                              : (bail.loyer === 0 ? "Gratuit" : formatPrice(bail.loyer || 0))}
                                          </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Type de comptabilité
                                          </p>
                                          <p className="text-sm font-medium">
                                            {bail.general.financialDetails.accountingType || "Non spécifié"}
                                          </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Conditions de paiement
                                          </p>
                                          <p className="text-sm font-medium">
                                            {bail.general.financialDetails.paymentTerms || "Non spécifié"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Période du bail */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                                      Période du bail
                                    </h4>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Loyer annuel</p>
                                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {isNewFormat(bail) 
                                              ? (bail.general?.financialDetails?.rent === "0" ? "Gratuit" : formatPrice(bail.general?.financialDetails?.rent || 0))
                                              : (bail.loyer === 0 ? "Gratuit" : formatPrice(bail.loyer || 0))}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-center">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Période</p>
                                          </div>
                                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {isNewFormat(bail)
                                              ? `${formatDate(bail.dates?.start)} - ${formatDate(bail.dates?.end)}`
                                              : `${formatDate(bail.dateDebut)} - ${formatDate(bail.dateFin)}`}
                  </p>
                </div>
                                        {bail.tauxOccupation !== undefined && (
                                          <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Occupation</p>
                                              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {isNewFormat(bail) ? bail.tauxOccupation : bail.tauxOccupation}%
                                              </span>
                                            </div>
                                            <Progress
                                              value={isNewFormat(bail) ? bail.tauxOccupation : bail.tauxOccupation}
                                              className={cn("h-2 bg-gray-100 dark:bg-gray-700", getProgressColor(isNewFormat(bail) ? bail.tauxOccupation : bail.tauxOccupation))}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Sous-bails */}
                                  {bail.sous_bails && bail.sous_bails.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <Layers className="h-4 w-4 mr-2 text-gray-500" />
                                        Sous-bails
                                      </h4>
                                      <div className="space-y-4">
                                        {bail.sous_bails.map((sousBail: Sublease, idx: number) => (
                                          <div key={`${bail.reference}-sous-bail-${idx}`} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                              <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                  <Badge variant="default" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                                    {sousBail.type}
                                                  </Badge>
                                                  <div>
                                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                                      <User className="h-4 w-4 mr-2 text-gray-500" />
                                                      Occupant
                                                    </h5>
                                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                                      {sousBail.locataire}
                                                    </p>
                                                  </div>
                                                </div>
                                                <Badge variant="default" className={sousBail.actif ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"}>
                                                  {sousBail.actif ? "Actif" : "Inactif"}
                                                </Badge>
                                              </div>
                                              <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                                                <div className="grid grid-cols-4 gap-4">
                                                  <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Loyer annuel</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                      {sousBail.loyer === 0 ? "Gratuit" : formatPrice(sousBail.loyer || 0)}
                                                    </p>
                                                  </div>
                                                  <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Surface</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                      {sousBail.surface} m²
                                                    </p>
                                                  </div>
                                                  <div className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Période</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                      {`${formatDate(sousBail.dateDebut)} - ${formatDate(sousBail.dateFin)}`}
                                                    </p>
                                                  </div>
                                                  {sousBail.tauxOccupation !== undefined && (
                                                    <div className="space-y-1">
                                                      <div className="flex justify-between items-center">
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Occupation</p>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                          {sousBail.tauxOccupation}%
                                                        </span>
                                                      </div>
                                                      <Progress
                                                        value={sousBail.tauxOccupation}
                                                        className={cn("h-2 bg-gray-100 dark:bg-gray-700", getProgressColor(sousBail.tauxOccupation))}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                                {sousBail.description && (
                                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                      {sousBail.description}
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun bail</h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Cette propriété ne possède actuellement aucun bail actif ou inactif.
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="projets" className="mt-0 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-gray-500" />
                          Projets & Travaux
                        </h3>
                        <Badge className="rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {property.projets.length}
                        </Badge>
                      </div>

                      {detailedProject && (
                        <div className="mb-6">
                          <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
                            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-gray-200 dark:border-gray-800">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <Building className="h-5 w-5" />
                                  </div>
            <div>
                                    <CardTitle className="text-base font-medium">
                                      {detailedProject.general_information.project_name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Réf: {detailedProject.general_information.project_id} | Phase:{" "}
                                      {detailedProject.general_information.project_phase}
                                    </p>
            </div>
                                </div>
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0 px-2.5 py-1 text-xs">
                                  {detailedProject.general_information.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="p-6 space-y-6">
                                {/* General Information Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                                      Informations générales
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type de projet</p>
                                        <p className="font-medium">
                                          {detailedProject.general_information.project_type}
                                        </p>
                                      </div>
                                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Classification</p>
                                        <p className="font-medium">
                                          {detailedProject.general_information.classification}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                                      Période du projet
                                    </h4>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                      <div className="grid grid-cols-3 divide-x divide-blue-200 dark:divide-blue-800">
                                        <div className="px-4 text-center">
                                          <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</span>
                                          <span className="block text-sm font-medium">
                                            {detailedProject.general_information.date}
                                          </span>
                                        </div>
                                        <div className="px-4 text-center">
                                          <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Début</span>
                                          <span className="block text-sm font-medium">
                                            {detailedProject.general_information.planned_start_date}
                                          </span>
                                        </div>
                                        <div className="px-4 text-center">
                                          <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fin</span>
                                          <span className="block text-sm font-medium">
                                            {detailedProject.general_information.planned_end_date}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Budget and Tasks Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Budget Section */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                      <Banknote className="h-4 w-4 mr-2 text-gray-500" />
                                      Budget & Financement
                                    </h4>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget initial</p>
                                          <p className="font-medium">{detailedProject.budget_information.original_budget}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget actuel</p>
                                          <p className="font-medium">{detailedProject.budget_information.budget_current}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payé</p>
                                          <p className="font-medium">{detailedProject.budget_information.paid}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prévision finale</p>
                                          <p className="font-medium">{detailedProject.budget_information.forecast_final}</p>
                                        </div>
                                      </div>

                                      <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-3">
                                        <h5 className="text-xs font-medium mb-2">Source de financement</h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="block text-gray-500 dark:text-gray-400 mb-1">Nom</span>
                                            <span className="font-medium">{detailedProject.funding_source.name}</span>
                                          </div>
                                          <div>
                                            <span className="block text-gray-500 dark:text-gray-400 mb-1">Année fiscale</span>
                                            <span className="font-medium">{detailedProject.funding_source.fiscal_year}</span>
                                          </div>
                                          <div className="col-span-2">
                                            <span className="block text-gray-500 dark:text-gray-400 mb-1">Engagement</span>
                                            <span className="font-medium">{detailedProject.funding_source.committed_to_project}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Tasks Section */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                      <Clock8 className="h-4 w-4 mr-2 text-gray-500" />
                                      Tâches principales
                                    </h4>
                                    <div className="space-y-4">
                                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-3">
                                          <span className="text-sm text-gray-500 dark:text-gray-400">Avancement:</span>
                                          <span className="text-sm font-medium">{detailedProject.tasks.completion_percentage}%</span>
                                        </div>
                                        <Progress
                                          value={detailedProject.tasks.completion_percentage}
                                          className={cn("h-2 bg-gray-200 dark:bg-gray-700", getProgressColor(detailedProject.tasks.completion_percentage))}
                                        />
                                      </div>
                                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                        <h5 className="text-xs font-medium mb-3">Tâches principales</h5>
                                        <div className="grid grid-cols-1 gap-2">
                                          {detailedProject.tasks.key_tasks.map((task, idx) => (
                                            <div key={idx} className="flex items-center text-sm bg-white dark:bg-gray-800 p-2 rounded">
                                              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                                              <span>{task}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Contacts Row */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                                    Contacts clés
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {detailedProject.key_contacts.map((contact, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium">{contact.name}</p>
                                            <p className="text-xs text-gray-500">{contact.role}</p>
                                          </div>
                                        </div>
                                        <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                                          <Phone className="h-3 w-3 mr-1" />
                                          {contact.phone}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Date du projet: {detailedProject.general_information.date}
                              </div>
                              <Button variant="outline" size="sm" className="text-xs">
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Voir tous les détails
      </Button>
                            </CardFooter>
                          </Card>
    </div>
                      )}

                      {property.projets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {property.projets.map((projet, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card className="overflow-hidden border-gray-200 dark:border-gray-800 h-full">
                                <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-base font-medium">{projet.nom}</CardTitle>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Responsable: {projet.responsable}
                                      </p>
                                    </div>
                                    <Badge
                                      className={cn(
                                        "rounded-full px-2.5 py-0.5 text-xs",
                                        projet.actif
                                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0"
                                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0",
                                      )}
                                    >
                                      {projet.actif ? "Projet actif" : "Terminé"}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                                      <p className="text-sm font-medium">{formatPrice(projet.budget)}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Période</p>
                                      <p className="font-medium">
                                        {formatDate(projet.dateDebut).split(" ").slice(0, 2).join(" ")} -{" "}
                                        {formatDate(projet.dateFin).split(" ").slice(0, 2).join(" ")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 dark:text-gray-400">Avancement:</span>
                                      <span className="font-medium">{projet.avancement}%</span>
                                    </div>
                                    <Progress
                                      value={projet.avancement}
                                      className={cn("h-2 bg-gray-100 dark:bg-gray-800", getProgressColor(projet.avancement))}
                                    />
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{projet.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun projet</h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Cette propriété ne possède actuellement aucun projet actif ou terminé.
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="taches" className="mt-0 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Clock8 className="h-5 w-5 text-gray-500" />
                          Tâches ouvertes
                        </h3>
                        <Badge className="rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {property.taches.length}
                        </Badge>
                      </div>
                      {property.taches.length > 0 ? (
                        <div className="space-y-3">
                          {property.taches.map((tache, index) => {
                            const priorityConfig = getPriorityConfig(tache.priorite)
                            return (
                              <Card key={index} className="overflow-hidden border-gray-200 dark:border-gray-800">
                                <CardHeader className="p-4 flex flex-row items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center",
                                        tache.priorite === "haute"
                                          ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                          : tache.priorite === "moyenne"
                                            ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                                      )}
                                    >
                                      {priorityConfig.icon && <priorityConfig.icon className="h-4 w-4" />}
                                    </div>
                                    <div>
                                      <h3 className="text-base font-medium">{tache.titre}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tache.description}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className={priorityConfig.className}>
                                    {tache.priorite.charAt(0).toUpperCase() + tache.priorite.slice(1)}
                                  </Badge>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigné à</p>
                                    <p className="font-medium">{tache.assigneA}</p>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Échéance</p>
                                    <p className="font-medium">{formatDate(tache.echeance)}</p>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                                    <p className="font-medium">{tache.statut}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                          <Clock8 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucune tâche</h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            Cette propriété ne possède actuellement aucune tâche ouverte.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        </Draggable>
      </AnimatePresence>
    </div>
  )
}




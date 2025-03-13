"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef } from "react"
import {
  Search,
  X,
  RefreshCcw,
  MapPin,
  Building,
  FileText,
  Briefcase,
  Wrench,
  Clock,
  ChevronUp,
  ListFilter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/property-card"
import { PropertyDetail } from "@/components/property-detail"
import { properties } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface OldBail {
  actif: boolean
  reference: string
  locataire: string
  surface: number
  loyer: number
  dateDebut: string
  dateFin: string
}

interface NewBail {
  leaseId: string
  title: string
  status: "actif" | "inactif" | "Propriété Gouvernementale"
  general: {
    leaseDetails: {
      type: string
      primaryUse: string
      baseYear: string
    }
    financialDetails: {
      rent: string
      accountingType: string
      paymentTerms: string
    }
  }
  dates: {
    start: string
    duration: string
    end: string
  }
  parties: {
    tenant: {
      organization: string
      legalName: string
      id: string
      location: string
    }
  }
  terms: {
    securityRequirements: string[]
  }
  metadata: {
    lastUpdated: string
  }
}

type Bail = OldBail | NewBail

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
  projets: Array<{
    actif: boolean
    nom: string
    responsable: string
    budget: number
    dateDebut: string
    dateFin: string
    avancement: number
    description: string
  }>
  taches: Array<{
    titre: string
    description: string
    priorite: "haute" | "moyenne" | "basse"
    assigneA: string
    echeance: string
    statut: string
    categorie: string
  }>
}

interface Filters {
  administratif: boolean
  education: boolean
  sante: boolean
  culturel: boolean
  securite: boolean
  status: "tous" | "actif" | "renovation" | "historique"
  ministere: string
  hasActiveLeases: boolean
  hasActiveProjects: boolean
  hasOpenTasks: boolean
}

export function PropertySearch() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [filters, setFilters] = useState<Filters>({
    administratif: false,
    education: false,
    sante: false,
    culturel: false,
    securite: false,
    status: "tous",
    ministere: "tous",
    hasActiveLeases: false,
    hasActiveProjects: false,
    hasOpenTasks: false,
  })

  // Function to normalize text for search
  const normalizeText = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
  }

  useEffect(() => {
    setMounted(true)

    // Gestionnaire de clic en dehors pour fermer les résultats
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        // Réduire la barre de recherche si elle est étendue
        if (isExpanded) {
          setIsExpanded(false)
        }
        // Fermer les filtres et le détail si ouverts
        setShowFilters(false)
        setShowDetail(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Add event listener for search updates
    const handleSearchUpdate = (e: CustomEvent) => {
      updateSearch(e.detail.term)
    }

    document.addEventListener('updateSearch', handleSearchUpdate as EventListener)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener('updateSearch', handleSearchUpdate as EventListener)
    }
  }, [isExpanded])

  const resetFilters = () => {
    setFilters({
      administratif: false,
      education: false,
      sante: false,
      culturel: false,
      securite: false,
      status: "tous",
      ministere: "tous",
      hasActiveLeases: false,
      hasActiveProjects: false,
      hasOpenTasks: false,
    })
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const normalizedSearchTerm = normalizeText(searchTerm)
      const normalizedPropertyName = normalizeText(property.nom)
      const normalizedPropertyAddress = normalizeText(property.adresse)
      const normalizedPropertyCity = normalizeText(property.ville)
      const normalizedPropertyMinistere = normalizeText(property.ministere)

      const matchesSearch =
        normalizedPropertyName.includes(normalizedSearchTerm) ||
        normalizedPropertyAddress.includes(normalizedSearchTerm) ||
        normalizedPropertyCity.includes(normalizedSearchTerm) ||
        normalizedPropertyMinistere.includes(normalizedSearchTerm)

      // Check if any type filter is active
      const anyTypeFilterActive = Object.keys(filters)
        .slice(0, 5)
        .some(key => filters[key as keyof Filters])

      // If no type filter is active, accept all types
      const matchesType = !anyTypeFilterActive || filters[property.type.toLowerCase() as keyof Filters]

      const matchesStatus = filters.status === "tous" || property.status === filters.status
      const matchesMinistere = filters.ministere === "tous" || property.ministere === filters.ministere
      const matchesActiveLeases =
        !filters.hasActiveLeases ||
        (property.bails && property.bails.some((bail) => {
          if ('leaseId' in bail) {
            return bail.status === "actif" || bail.status === "Propriété Gouvernementale"
          }
          return bail.actif
        }))
      const matchesActiveProjects =
        !filters.hasActiveProjects || (property.projets && property.projets.some((projet) => projet.actif))
      const matchesOpenTasks = !filters.hasOpenTasks || (property.taches && property.taches.length > 0)

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesMinistere &&
        matchesActiveLeases &&
        matchesActiveProjects &&
        matchesOpenTasks
      )
    })
  }, [searchTerm, filters])

  const handleSearchFocus = () => {
    setIsExpanded(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value) {
      setIsExpanded(true)
    }
  }

  // Add effect to handle input and focus events
  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      setSearchTerm(target.value)
      if (target.value) {
        setIsExpanded(true)
      }
    }

    const handleFocus = () => {
      setIsExpanded(true)
    }

    input.addEventListener('input', handleInput)
    input.addEventListener('focus', handleFocus)
    
    return () => {
      input.removeEventListener('input', handleInput)
      input.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleClearSearch = () => {
    setSearchTerm("")
    inputRef.current?.focus()
  }

  // Expose method to update search
  const updateSearch = (term: string) => {
    setSearchTerm(term)
    setIsExpanded(true)
    setShowFilters(false) // Hide filters when property is selected
    inputRef.current?.focus()
  }

  if (!mounted) {
    return <div className="h-12 w-full max-w-md bg-muted animate-pulse rounded-full" />
  }

  return (
    <div
      ref={searchContainerRef}
      data-search-component
      className={cn(
        "absolute z-10 transition-all duration-300",
        isExpanded
          ? "top-4 left-4 right-4 md:left-4 md:right-auto md:w-[450px]"
          : "top-4 left-4 right-4 md:left-4 md:right-auto md:w-[400px]",
      )}
    >
      {/* Barre de recherche principale */}
      <div className={cn("relative transition-all duration-300", isExpanded && "mb-0")}>
        <div
          className={cn("relative group rounded-full overflow-hidden", isExpanded && "rounded-t-2xl rounded-b-none")}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-30">
            <Search className="h-5 w-5 text-gray-500/90" />
          </div>
          <Input
            ref={inputRef}
            type="search"
            placeholder="Rechercher une propriété..."
            className={cn(
              "pl-12 pr-12 py-6 h-14 bg-white/95 backdrop-blur-sm shadow-lg border-gray-200/70",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300",
              "text-base relative z-10",
              isExpanded ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-full",
            )}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1 z-30">
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100/50 rounded-full transition-colors duration-150"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Effacer</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 hover:bg-gray-100/50 rounded-full transition-colors duration-150",
                showFilters && "bg-gray-100/80",
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <ListFilter className="h-4 w-4 text-gray-500" />
              <span className="sr-only">Filtres</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      <AnimatePresence>
        {isExpanded && showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white/95 backdrop-blur-sm border-x border-gray-200/70"
          >
            <div className="p-4 space-y-6 bg-gray-50/80">
              {/* Type de propriété */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  Type de propriété
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(filters)
                    .slice(0, 5)
                    .map((key) => (
                      <Badge
                        key={key}
                        variant={filters[key as keyof Filters] ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer rounded-full py-1.5 px-3 text-xs font-medium transition-all",
                          filters[key as keyof Filters]
                            ? "bg-primary/90 text-white hover:bg-primary/80"
                            : "hover:bg-gray-100",
                        )}
                        onClick={() => setFilters({ ...filters, [key]: !filters[key as keyof Filters] })}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Statut */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Statut
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["tous", "actif", "renovation", "historique"].map((status) => (
                    <Badge
                      key={status}
                      variant={filters.status === status ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer rounded-full py-1.5 px-3 text-xs font-medium transition-all",
                        filters.status === status
                          ? "bg-primary/90 text-white hover:bg-primary/80"
                          : "hover:bg-gray-100",
                      )}
                      onClick={() => setFilters({ ...filters, status: status as typeof filters.status })}
                    >
                      {status === "tous" ? "Tous" :
                       status === "actif" ? "Actif" :
                       status === "renovation" ? "En rénovation" :
                       "Monument Historique"}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <ListFilter className="h-4 w-4 mr-2 text-gray-500" />
                  Filtres additionnels
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={filters.hasActiveLeases ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer rounded-full py-1.5 px-3 text-xs font-medium transition-all",
                      filters.hasActiveLeases
                        ? "bg-primary/90 text-white hover:bg-primary/80"
                        : "hover:bg-gray-100",
                    )}
                    onClick={() => setFilters({ ...filters, hasActiveLeases: !filters.hasActiveLeases })}
                  >
                    <Briefcase className="h-3.5 w-3.5 mr-1.5 inline-block" />
                    Bails actifs
                  </Badge>
                  <Badge
                    variant={filters.hasActiveProjects ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer rounded-full py-1.5 px-3 text-xs font-medium transition-all",
                      filters.hasActiveProjects
                        ? "bg-primary/90 text-white hover:bg-primary/80"
                        : "hover:bg-gray-100",
                    )}
                    onClick={() => setFilters({ ...filters, hasActiveProjects: !filters.hasActiveProjects })}
                  >
                    <Wrench className="h-3.5 w-3.5 mr-1.5 inline-block" />
                    Projets en cours
                  </Badge>
                  <Badge
                    variant={filters.hasOpenTasks ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer rounded-full py-1.5 px-3 text-xs font-medium transition-all",
                      filters.hasOpenTasks
                        ? "bg-primary/90 text-white hover:bg-primary/80"
                        : "hover:bg-gray-100",
                    )}
                    onClick={() => setFilters({ ...filters, hasOpenTasks: !filters.hasOpenTasks })}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5 inline-block" />
                    Tâches ouvertes
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters} 
                  className="text-xs bg-white hover:bg-gray-100"
                >
                  <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats de recherche */}
      <AnimatePresence>
        {isExpanded && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "border-x border-b border-gray-200/70 rounded-b-2xl bg-white/95 backdrop-blur-sm shadow-lg",
              "max-h-[calc(100vh-200px)] overflow-y-auto",
            )}
          >
            <div className="sticky top-0 z-10 flex justify-between items-center p-3 border-b bg-white/90 backdrop-blur-sm">
              <div className="text-sm font-medium text-gray-700">
                {filteredProperties.length} résultat{filteredProperties.length !== 1 ? "s" : ""}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
              >
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Réduire</span>
              </Button>
            </div>

            <div className="p-3 space-y-3">
              {filteredProperties.length ? (
                filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property as Property}
                    onClick={() => {
                      setSelectedProperty(property as Property)
                      setShowDetail(true)
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucune propriété trouvée</p>
                  <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedProperty && showDetail && (
        <PropertyDetail property={selectedProperty} onClose={() => setShowDetail(false)} />
      )}
    </div>
  )
}


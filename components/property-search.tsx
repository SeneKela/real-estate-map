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
  ChevronDown,
  Building2,
  Clock8,
  Tag,
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
import type { Property } from "@/types/property"

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

  // Add new type to track matches
  type MatchType = {
    type: 'property' | 'bail' | 'project' | 'task'
    text: string
    subtext?: string
  }

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
    return (properties as Property[]).filter((property) => {
      const normalizedSearchTerm = normalizeText(searchTerm)
      const normalizedPropertyName = normalizeText(property.nom)
      const normalizedPropertyAddress = normalizeText(property.adresse)
      const normalizedPropertyCity = normalizeText(property.ville)
      const normalizedPropertyMinistere = normalizeText(property.ministere)

      // Search in bails
      const matchesInBails = property.bails?.some(bail => {
        if ('leaseId' in bail) {
          // For new bail format
          return (
            normalizeText(bail.title || '').includes(normalizedSearchTerm) ||
            normalizeText(bail.leaseId || '').includes(normalizedSearchTerm) ||
            normalizeText(bail.parties?.tenant?.organization || '').includes(normalizedSearchTerm) ||
            normalizeText(bail.parties?.tenant?.legalName || '').includes(normalizedSearchTerm)
          )
        } else {
          // For old bail format
          return (
            normalizeText(bail.reference || '').includes(normalizedSearchTerm) ||
            normalizeText(bail.locataire || '').includes(normalizedSearchTerm)
          )
        }
      }) || false

      // Search in projects
      const matchesInProjects = property.projets?.some(projet => 
        normalizeText(projet.nom).includes(normalizedSearchTerm) ||
        normalizeText(projet.description).includes(normalizedSearchTerm) ||
        normalizeText(projet.responsable).includes(normalizedSearchTerm)
      ) || false

      // Search in tasks
      const matchesInTasks = property.taches?.some(tache =>
        normalizeText(tache.titre).includes(normalizedSearchTerm) ||
        normalizeText(tache.description).includes(normalizedSearchTerm) ||
        normalizeText(tache.assigneA).includes(normalizedSearchTerm)
      ) || false

      const matchesSearch =
        normalizedPropertyName.includes(normalizedSearchTerm) ||
        normalizedPropertyAddress.includes(normalizedSearchTerm) ||
        normalizedPropertyCity.includes(normalizedSearchTerm) ||
        normalizedPropertyMinistere.includes(normalizedSearchTerm) ||
        matchesInBails ||
        matchesInProjects ||
        matchesInTasks

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

  // Function to get matches for a property
  const getMatches = (property: Property): MatchType[] => {
    const matches: MatchType[] = []
    const normalizedSearchTerm = normalizeText(searchTerm)

    // Only calculate matches if there's a search term
    if (!searchTerm) return []

    // Property matches
    if (normalizeText(property.nom).includes(normalizedSearchTerm)) {
      matches.push({ type: 'property', text: 'Propriété', subtext: property.nom })
    }
    if (normalizeText(property.adresse).includes(normalizedSearchTerm)) {
      matches.push({ type: 'property', text: 'Adresse', subtext: property.adresse })
    }
    if (normalizeText(property.ministere).includes(normalizedSearchTerm)) {
      matches.push({ type: 'property', text: 'Ministère', subtext: property.ministere })
    }

    // Bail matches
    property.bails?.forEach(bail => {
      if ('leaseId' in bail) {
        if (normalizeText(bail.title || '').includes(normalizedSearchTerm)) {
          matches.push({ type: 'bail', text: 'Bail', subtext: bail.title })
        }
        if (normalizeText(bail.parties?.tenant?.organization || '').includes(normalizedSearchTerm)) {
          matches.push({ type: 'bail', text: 'Locataire', subtext: bail.parties.tenant.organization })
        }
      } else {
        if (normalizeText(bail.locataire || '').includes(normalizedSearchTerm)) {
          matches.push({ type: 'bail', text: 'Locataire', subtext: bail.locataire })
        }
      }
    })

    // Project matches
    property.projets?.forEach(projet => {
      if (normalizeText(projet.nom).includes(normalizedSearchTerm)) {
        matches.push({ type: 'project', text: 'Projet', subtext: projet.nom })
      }
      if (normalizeText(projet.responsable).includes(normalizedSearchTerm)) {
        matches.push({ type: 'project', text: 'Responsable', subtext: projet.responsable })
      }
    })

    // Task matches
    property.taches?.forEach(tache => {
      if (normalizeText(tache.titre).includes(normalizedSearchTerm)) {
        matches.push({ type: 'task', text: 'Tâche', subtext: tache.titre })
      }
      if (normalizeText(tache.assigneA).includes(normalizedSearchTerm)) {
        matches.push({ type: 'task', text: 'Assigné à', subtext: tache.assigneA })
      }
    })

    return matches
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
          </div>
        </div>
      </div>

      {/* Search match tags */}
      {isExpanded && searchTerm && (
        <div className="px-4 py-2 bg-white/95 backdrop-blur-sm border-x border-gray-200/70">
          <div className="flex flex-wrap gap-2">
            {(() => {
              const allMatches = Array.from(new Set(filteredProperties.flatMap(property => 
                getMatches(property).map(match => JSON.stringify(match))
              )))
              const displayedMatches = allMatches.slice(0, 3)
              const remainingCount = allMatches.length - 3

              return (
                <>
                  {displayedMatches.map((matchString) => {
                    const match = JSON.parse(matchString) as MatchType
                    return (
                      <Badge
                        key={`${match.type}-${match.text}-${match.subtext}`}
                        variant="secondary"
                        className="flex items-center gap-1.5 py-1 px-2 bg-gray-100/80 cursor-pointer hover:bg-gray-200/80 transition-colors"
                        onClick={() => {
                          setSearchTerm(match.subtext || "")
                          setIsExpanded(true)
                          inputRef.current?.focus()
                        }}
                      >
                        {match.type === 'property' && <Building2 className="h-3 w-3" />}
                        {match.type === 'bail' && <Briefcase className="h-3 w-3" />}
                        {match.type === 'project' && <Wrench className="h-3 w-3" />}
                        {match.type === 'task' && <Clock8 className="h-3 w-3" />}
                        <span className="font-medium">{match.text}:</span>
                        <span className="text-gray-600">{match.subtext}</span>
                      </Badge>
                    )
                  })}
                  {remainingCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 py-1 px-2 bg-gray-100/80"
                    >
                      <Tag className="h-3 w-3" />
                      <span className="text-gray-600">+{remainingCount} autres</span>
                    </Badge>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}

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
              "h-[calc(100vh-180px)] flex flex-col", // Set fixed height and make it a flex container
            )}
          >
            <div className="flex flex-col">
              {/* Results header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-3 border-b bg-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-700">
                    {filteredProperties.length} résultat{filteredProperties.length !== 1 ? "s" : ""}
                  </div>
                  {filteredProperties.length > 0 && (
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
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Réduire</span>
                </Button>
              </div>

              {/* Filters section - now directly under the header */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-white/95 backdrop-blur-sm border-b border-gray-200/70"
                  >
                    <div className="p-4 space-y-6">
                      {/* Type de propriété */}
                      <div>
                        <h4 className="font-medium text-sm mb-3 flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-500" />
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
                            Baux actifs
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
                            <Clock8 className="h-3.5 w-3.5 mr-1.5 inline-block" />
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
            </div>

            {/* Results list - now scrollable within its container */}
            <div className="overflow-y-auto flex-1">
              <div className="p-3 space-y-3">
                {filteredProperties.length ? (
                  filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onClick={() => {
                        setSelectedProperty(property)
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


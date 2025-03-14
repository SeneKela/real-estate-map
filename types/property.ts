export interface OldBail {
  reference: string
  locataire: string
  surface: number
  loyer: number
  dateDebut: string
  dateFin: string
  actif: boolean
}

export interface NewBail {
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

export type Bail = OldBail | NewBail

export interface Property {
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
  projets: Project[]
  taches: Task[]
}

export interface PropertyDetailProps {
  property: Property
  onClose: () => void
}

export interface NewsItem {
  title: string
  source: string
  date: string
  summary: string
  url: string
  image?: string
}

export interface Lease {
  leaseId: string
  title: string
  status: string
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

export interface Project {
  nom: string
  responsable: string
  actif: boolean
  budget: number
  dateDebut: string
  dateFin: string
  avancement: number
  description: string
}

export interface Task {
  titre: string
  description: string
  priorite: "haute" | "moyenne" | "basse"
  assigneA: string
  echeance: string
  statut: string
  categorie: string
} 
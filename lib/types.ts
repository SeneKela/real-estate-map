export interface PropertyType {
  id: string
  title: string
  type: "house" | "apartment" | "condo" | "land" | "commercial"
  price: number
  location: string
  description: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  images: string[]
  features: string[]
  isNew: boolean
  coordinates: {
    x: number
    y: number
  }
  projectDetails?: {
    developer: string
    completionDate: string
    totalUnits: number
    status: string
  }
}


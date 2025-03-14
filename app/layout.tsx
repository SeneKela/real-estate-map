import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Carte des propriétés",
  description: "Application de gestion des propriétés gouvernementales",
}

// Ajouter le style global pour les marqueurs de carte
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <style>
          {`
            .custom-marker {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

import './globals.css'
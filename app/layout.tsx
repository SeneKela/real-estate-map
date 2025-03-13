import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "IBM -Tririga Redesign pour DIE",
  description: "Created by Martin Burkel",
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
      <body>{children}</body>
    </html>
  )
}



import './globals.css'
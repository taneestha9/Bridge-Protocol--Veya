import type { Metadata } from "next"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { DemoBanner } from "@/components/demo-banner"

export const metadata: Metadata = {
  title: "Bridge Protocol",
  description: "Open infrastructure for grassroots welfare coordination."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><DemoBanner />{children}<Analytics /></body>
    </html>
  )
}

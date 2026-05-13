"use client"

import { createContext, useContext } from "react"

export interface PublicSettings {
  whatsappNumber: string
  supportEmail: string
}

const PublicSettingsContext = createContext<PublicSettings>({
  whatsappNumber: "",
  supportEmail: "hello@gogmgo.com",
})

export function PublicSettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: PublicSettings
}) {
  return (
    <PublicSettingsContext.Provider value={settings}>
      {children}
    </PublicSettingsContext.Provider>
  )
}

export function usePublicSettings(): PublicSettings {
  return useContext(PublicSettingsContext)
}

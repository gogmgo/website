"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ContactModal } from "@/components/ui/ContactModal"
import { AnalyticsEvents } from "@/lib/analytics"

interface ModalContextValue {
  openModal: () => void
}

const ModalContext = createContext<ModalContextValue>({ openModal: () => {} })

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  function openModal() {
    AnalyticsEvents.contactFormOpen()
    setIsOpen(true)
  }

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </ModalContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalContext)
}

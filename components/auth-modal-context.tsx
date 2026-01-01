"use client"

import { createContext, useContext, useState } from "react"

type AuthMode = "signin" | "signup" | null

interface AuthModalContextValue {
  mode: AuthMode
  openSignIn: () => void
  openSignUp: () => void
  close: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AuthMode>(null)

  return (
    <AuthModalContext.Provider
      value={{
        mode,
        openSignIn: () => setMode("signin"),
        openSignUp: () => setMode("signup"),
        close: () => setMode(null),
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider")
  }
  return ctx
}

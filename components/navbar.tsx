"use client"

import { Button } from "@/components/ui/button"
import { PlaneTakeoff } from "lucide-react"
import { useAuth } from "@/lib/use-auth"
import { useAuthModal } from "@/components/auth-modal-context"
import { useRouter } from "next/navigation"

export function Navbar() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { openSignIn, openSignUp } = useAuthModal()

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={async () => {
            await signOut()
            router.push("/")
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-linear-to-br from-accent to-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg"><PlaneTakeoff /></span>
          </div>
          <span className="text-xl font-bold text-foreground">TripLyst</span>
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <Button className="cursor-pointer"
                variant="ghost"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button className="cursor-pointer"
                variant="outline"
                onClick={async () => {
                  await signOut()
                  router.push("/")
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </a>
              </div>

              <Button variant="ghost" onClick={openSignIn} className="cursor-pointer">
                Sign In
              </Button>
              <Button onClick={openSignUp} className="cursor-pointer">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
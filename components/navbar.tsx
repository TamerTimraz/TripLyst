"use client"

import { Button } from "@/components/ui/button"
import { PlaneTakeoff } from "lucide-react"

interface NavbarProps {
  onSignInClick: () => void
  onSignUpClick: () => void
}

export function Navbar({ onSignInClick, onSignUpClick }: NavbarProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-accent to-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg"><PlaneTakeoff /></span>
          </div>
          <span className="text-xl font-bold text-foreground">TripLyst</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onSignInClick} className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer">
            Sign In
          </Button>
          <Button onClick={onSignUpClick} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  )
}

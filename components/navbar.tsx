"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { PlaneTakeoff, Plus, Bookmark, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/lib/use-auth"
import { useAuthModal } from "@/components/auth-modal-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function Navbar() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { openSignIn, openSignUp } = useAuthModal()

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => {
            if (!loading && user) {
              router.push("/home")
            }
          }}
          className={`flex items-center gap-2 ${
            user ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <div className="w-8 h-8 bg-linear-to-br from-accent to-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">
              <PlaneTakeoff />
            </span>
          </div>
          <span className="text-xl font-bold text-foreground">TripLyst</span>
        </div>

        {/* Authenticated User */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="/home"
                  className="text-foreground hover:text-foreground/70 transition-colors font-medium"
                >
                  Browse
                </Link>

                <Link
                  href="/my-itineraries"
                  className="text-foreground hover:text-foreground/70 transition-colors font-medium"
                >
                  My Itineraries
                </Link>

                <div
                  onClick={() => router.push("/saved-itineraries")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="font-medium text-foreground hover:text-foreground/70 transition-colors">
                    Saved
                  </span>
                </div>

                <Button asChild className="gap-2">
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    Create Itinerary
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Settings className="h-5 w-5 cursor-pointer hover:text-foreground/70"/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background">
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={async () => {
                        await signOut()
                        router.push("/")
                      }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              {/* Non-Authenticated user on landing page */}
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How it Works
                </a>
              </div>

              <Button
                variant="ghost"
                onClick={openSignIn}
                className="cursor-pointer"
              >
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
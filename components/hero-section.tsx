"use client"

import { Button } from "@/components/ui/button"
import { useAuthModal } from "@/components/auth-modal-context"

export function HeroSection() {
  const { openSignUp } = useAuthModal()

  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">Plan Your Perfect Journey</h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Create custom travel itineraries and share your adventures with the world. Discover inspiring trips from
              fellow travelers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={openSignUp}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base cursor-pointer"
            >
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base border-border text-foreground hover:bg-muted bg-transparent cursor-pointer"
            >
              Explore Itineraries
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-border shadow-lg">
            <img src="/images/hero_image.jpg" alt="Travel inspiration" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}

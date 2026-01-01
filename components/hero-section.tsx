"use client"

import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="bg-linear-to-b from-accent/20 to-background py-20 md:py-32">
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
              onClick={onGetStarted}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base"
            >
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base border-border text-foreground hover:bg-muted bg-transparent"
            >
              Explore Itineraries
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-border shadow-lg">
            <img src="/travelers-exploring-beautiful-destinations.jpg" alt="Travel inspiration" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}

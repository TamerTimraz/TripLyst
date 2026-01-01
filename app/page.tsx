"use client"

import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">© 2025 TripLyst. Craft your perfect journey.</p>
        </div>
      </footer>
    </div>
  )
}

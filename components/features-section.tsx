"use client"

import { MapPin, Share2, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Detailed Itineraries",
      description: "Create day-by-day travel plans with activities, restaurants, and must-see destinations.",
    },
    {
      icon: Share2,
      title: "Share Your Trips",
      description: "Make your itineraries public and inspire others to explore the same destinations.",
    },
    {
      icon: Users,
      title: "Community Tips",
      description: "Discover recommendations from real travelers and refine your plans based on experiences.",
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything You Need to Plan
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Create, organize, and share your travel adventures with powerful planning tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

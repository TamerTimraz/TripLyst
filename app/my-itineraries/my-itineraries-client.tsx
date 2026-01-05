"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Globe, Lock } from "lucide-react"
import { ItineraryCard } from "@/components/itinerary-card"
import { ItineraryWithAccount } from "@/types"

type MyItinerariesClientProps = {
  myItineraries: ItineraryWithAccount[]
}

export default function MyItinerariesClient({ myItineraries }: MyItinerariesClientProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "public" | "private">("all")

  const publicCount = myItineraries.filter((i) => i.visibility === "public").length
  const privateCount = myItineraries.filter((i) => i.visibility === "private").length

  const filteredItineraries = myItineraries.filter((itinerary) => {
    if (activeFilter === "all") return true
    return itinerary.visibility === activeFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">My Itineraries</h1>
            <p className="text-muted-foreground">
              {publicCount} public, {privateCount} private
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 rounded-none border-b-2 transition-colors ${
              activeFilter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All ({myItineraries.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 rounded-none border-b-2 transition-colors ${
              activeFilter === "public"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveFilter("public")}
          >
            <Globe className="h-4 w-4" />
            Public ({publicCount})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 rounded-none border-b-2 transition-colors ${
              activeFilter === "private"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveFilter("private")}
          >
            <Lock className="h-4 w-4" />
            Private ({privateCount})
          </Button>
        </div>

        {/* Itineraries Grid */}
        {filteredItineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries.map((itinerary) => (
              <div key={itinerary.id} className="relative">
                <ItineraryCard {...itinerary} />
                {itinerary.visibility === "private" && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Private
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No itineraries yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start planning your next adventure by creating your first travel itinerary.
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Itinerary
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItineraryCard } from "@/components/itinerary-card"

// Mock data for demonstration purposes
const allItineraries = [
  {
    id: "1",
    title: "Hidden Gems of Tokyo: A Local's Guide",
    destination: "Tokyo, Japan",
    imageUrl: "/tokyo-streets-temples.jpg",
    duration: "7 days",
    author: {
      name: "Yuki Tanaka",
      avatar: "/asian-woman-portrait.png",
    },
    likes: 234,
    saves: 89,
  },
  {
    id: "2",
    title: "Mediterranean Coast Road Trip",
    destination: "Southern France & Italy",
    imageUrl: "/mediterranean-coastal-road-amalfi.jpg",
    duration: "10 days",
    author: {
      name: "Marco Rossi",
      avatar: "/italian-man-portrait.png",
    },
    likes: 567,
    saves: 203,
  },
  {
    id: "3",
    title: "Bali Wellness & Adventure",
    destination: "Bali, Indonesia",
    imageUrl: "/bali-rice-terraces-temple.jpg",
    duration: "5 days",
    author: {
      name: "Sarah Chen",
      avatar: "/smiling-woman-portrait.png",
    },
    likes: 432,
    saves: 178,
  },
  {
    id: "4",
    title: "Iceland's Ring Road Adventure",
    destination: "Reykjavik, Iceland",
    imageUrl: "/iceland-waterfalls-northern-lights.jpg",
    duration: "8 days",
    author: {
      name: "Erik Hansen",
      avatar: "/scandinavian-man-portrait.jpg",
    },
    likes: 678,
    saves: 245,
  },
  {
    id: "5",
    title: "Morocco: Deserts & Medinas",
    destination: "Morocco",
    imageUrl: "/morocco-marrakech-desert.jpg",
    duration: "9 days",
    author: {
      name: "Amina El-Fassi",
      avatar: "/moroccan-woman-portrait.png",
    },
    likes: 389,
    saves: 156,
  },
  {
    id: "6",
    title: "New Zealand South Island Trek",
    destination: "South Island, New Zealand",
    imageUrl: "/new-zealand-mountains-lakes.jpg",
    duration: "12 days",
    author: {
      name: "James Wright",
      avatar: "/outdoorsman-portrait.jpg",
    },
    likes: 512,
    saves: 198,
  },
  {
    id: "7",
    title: "Paris Food & Culture Tour",
    destination: "Paris, France",
    imageUrl: "/paris-eiffel-tower-cafe.jpg",
    duration: "4 days",
    author: {
      name: "Sophie Laurent",
      avatar: "/french-woman-portrait.jpg",
    },
    likes: 423,
    saves: 167,
  },
  {
    id: "8",
    title: "Costa Rica Wildlife Adventure",
    destination: "Costa Rica",
    imageUrl: "/costa-rica-jungle-wildlife.jpg",
    duration: "6 days",
    author: {
      name: "Carlos Rivera",
      avatar: "/costa-rican-man-portrait.jpg",
    },
    likes: 345,
    saves: 134,
  },
  {
    id: "9",
    title: "Scottish Highlands Journey",
    destination: "Scotland",
    imageUrl: "/scottish-highlands-castle.jpg",
    duration: "7 days",
    author: {
      name: "Ian MacLeod",
      avatar: "/scottish-man-portrait.jpg",
    },
    likes: 289,
    saves: 112,
  },
]

export default async function Home() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-foreground">
              Discover Inspiring Itineraries
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Explore travel plans created by adventurers worldwide. Find your next journey and save the trips that
              inspire you.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input placeholder="Search destinations, activities, or travelers..." className="pl-10 h-12 bg-card" />
              </div>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* All Itineraries */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">All Itineraries</h2>
            <p className="text-muted-foreground mt-1">Browse travel plans from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} {...itinerary} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

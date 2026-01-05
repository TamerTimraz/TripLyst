import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ItineraryCard } from "@/components/itinerary-card"
import { BookmarkedItineraryWithAccount, ItineraryWithAccount } from "@/types"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function SavedItineraries() {
  const supabase = await createSupabaseServerClient()

  const {data: {user}} = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: savedItineraries, error } = await supabase
    .from("itinerary_bookmarks")
    .select(
      `
      itineraries(
        *, 
        accounts (name)
      )
    `
    )
    .eq("account_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<BookmarkedItineraryWithAccount[]>()

  const itineraries: ItineraryWithAccount[] =
    savedItineraries?.map((item) => item.itineraries) || []

  if (error) {
    console.error("Error fetching itineraries:", error.message)
    throw new Error("Failed to fetch itineraries")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Saved Itineraries</h1>
            <p className="text-muted-foreground">{itineraries.length} saved trips</p>
          </div>
        </div>

        <div className="border-b border-border mb-8" />
        {/* Saved Itineraries Grid */}
        {itineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} {...itinerary} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No saved itineraries</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start exploring and save itineraries that inspire you for future trips.
            </p>
            <Button asChild>
              <a href="/home">Browse Itineraries</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

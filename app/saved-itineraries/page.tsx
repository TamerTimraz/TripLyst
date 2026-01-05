import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ItineraryCard } from "@/components/itinerary-card"
import { BookmarkedItineraryWithAccount, ItineraryWithAccount } from "@/types"

export default async function SavedItineraries() {
  const supabase = await createSupabaseServerClient()

  const {data: {user}} = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: savedItineraries, error } = await supabase
    .from("itinerary_bookmarks")
    .select(`
      itineraries(
        *, 
        accounts (name, email)
      )
    `)
    .eq("account_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<BookmarkedItineraryWithAccount[]>()

  const itineraries: ItineraryWithAccount[] = savedItineraries?.map((item) => item.itineraries) || []


    if (error) {
        console.error("Error fetching itineraries:", error.message)
        throw new Error("Failed to fetch itineraries")
    }

  return (
      <div className="min-h-screen bg-background">
        {/* Saved Itineraries */}
        <section className="py-12">
          <div className="container mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Saved Itineraries
              </h2>
              <p className="text-muted-foreground mt-1">
                View your saved itineraries
              </p>
            </div>
  
            {savedItineraries.length === 0 ? (
              <p className="text-muted-foreground">
                You have not saved any itineraries yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary) => (
                  <ItineraryCard key={itinerary.id} {...itinerary}/>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    )
}

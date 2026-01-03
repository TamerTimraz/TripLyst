import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ItineraryCard } from "@/components/itinerary-card"
import { Itinerary } from "@/types"

export default async function MyItineraries() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: myItineraries, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("account_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<Itinerary[]>()

  if (error) {
    console.error("Error fetching itineraries:", error.message)
    throw new Error("Failed to fetch itineraries")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* My Itineraries */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              My Itineraries
            </h2>
            <p className="text-muted-foreground mt-1">
              View your personal travel plans
            </p>
          </div>

          {myItineraries.length === 0 ? (
            <p className="text-muted-foreground">
              You have not created any itineraries yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} {...itinerary} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

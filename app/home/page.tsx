import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItineraryCard } from "@/components/itinerary-card"
import { ItineraryListItemWithUser } from "@/types"
import { Input } from "@/components/ui/input"

export default async function Home({ 
  searchParams
}: { 
  searchParams: Promise<{
    search?: string 
    sort?: "newest" | "oldest"
  }>
}) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const params = await searchParams

  const search = params.search?.trim()
  const sort = params.sort ?? "newest"

  let query = supabase
    .from("itineraries")
    .select(
      `*,
      author:accounts (name, image_url),
      itinerary_bookmarks!left(itinerary_id, account_id)`
    )
    .eq("visibility", "public")
  
  if (search) {
    query = query.ilike("destination", `%${search}%`)
  }

  query = query.order("created_at", {
    ascending: sort === "oldest"
  })

  const { data: allItineraries, error } = await query.overrideTypes<ItineraryListItemWithUser[]>()

  if (error) {
    console.error("Error fetching itineraries:", error.message)
    throw new Error("Failed to fetch itineraries")
  }

  const itineraries = allItineraries.map((itinerary) => ({
    ...itinerary,
    is_bookmarked: itinerary.itinerary_bookmarks && itinerary.itinerary_bookmarks.length > 0,
    current_user_id: user.id
  }))

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
              Explore travel plans created by adventurers worldwide. Find your
              next journey and save the trips that inspire you.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form method="GET" className="flex gap-3 items-center">
              <div className="relative flex-1 shadow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  defaultValue={params.search}
                  placeholder="Search destinations..."
                  className="pl-10 h-12 bg-background"
                />
              </div>

              <select
                name="sort"
                defaultValue={params.sort ?? "newest"}
                className="h-12 rounded-md border bg-background px-3 text-sm cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

              <Button type="submit" size="lg" className="h-12 cursor-pointer">
                Apply
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* All Itineraries */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              All Itineraries
            </h2>
            <p className="text-muted-foreground mt-1">
              Browse travel plans from your fellow adventurers
            </p>
          </div>

          {itineraries.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <p className="text-xl font-semibold text-foreground mb-2">
                  No itineraries found
                </p>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your travel adventures with the
                  community!
                </p>
                <Button size="lg" asChild>
                  <a href="/create">Create Your First Itinerary</a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} {...itinerary} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

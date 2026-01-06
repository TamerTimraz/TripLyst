import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ItineraryListItemWithUser } from "@/types"
import MyItinerariesClient from "./my-itineraries-client"

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
    .select(
      `
      *,
      author:accounts (name),
      itinerary_bookmarks!left(itinerary_id, account_id)`
    )
    .eq("account_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<ItineraryListItemWithUser[]>()

  if (error) {
    console.error("Error fetching itineraries:", error.message)
    throw new Error("Failed to fetch itineraries")
  }

  const itineraries = myItineraries.map((itinerary) => ({
    ...itinerary,
    is_bookmarked: itinerary.itinerary_bookmarks && itinerary.itinerary_bookmarks.length > 0,
    current_user_id: user.id
  }))

  return (
    <MyItinerariesClient myItineraries={itineraries || []} />
  )
}

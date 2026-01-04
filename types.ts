import { Database } from "@/lib/supabase/database.types"

export type BookmarkedItinerary = {
  itineraries: Database["public"]["Tables"]["itineraries"]["Row"]
}

export type Itinerary = Database["public"]["Tables"]["itineraries"]["Row"]
export type ItineraryDay = Database["public"]["Tables"]["itinerary_days"]["Row"]
export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type Account = Database["public"]["Tables"]["accounts"]["Row"]

export type ItineraryWithDetails = Itinerary & {
  accounts: Account
  itinerary_days: (ItineraryDay & {
    activities: Activity[]
  })[]
}
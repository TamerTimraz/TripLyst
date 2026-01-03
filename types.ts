import { Database } from "@/lib/supabase/database.types"

export type BookmarkedItinerary = {
  itineraries: Database["public"]["Tables"]["itineraries"]["Row"]
}

export type Itinerary = Database["public"]["Tables"]["itineraries"]["Row"]
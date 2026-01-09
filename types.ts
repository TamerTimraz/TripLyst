import { Database } from "@/lib/supabase/database.types"

export type Itinerary = Database["public"]["Tables"]["itineraries"]["Row"]
export type ItineraryDay = Database["public"]["Tables"]["itinerary_days"]["Row"]
export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type Account = Database["public"]["Tables"]["accounts"]["Row"]
export type ItineraryBookmark = Database["public"]["Tables"]["itinerary_bookmarks"]["Row"]

export type ItineraryWithSchedule = Itinerary & {
  author: Account
  itinerary_days: (ItineraryDay & {
    activities: Activity[]
  })[]
  itinerary_bookmarks: ItineraryBookmark[]
}

export type ItineraryListItemWithUser = Itinerary & {
  author: Account
  is_bookmarked: boolean
  current_user_id: string
}

export type BookmarkedItineraryRow = {
  itinerary: ItineraryListItemWithUser
}
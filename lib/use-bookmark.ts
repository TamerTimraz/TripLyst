"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function useBookmark(
  itineraryId: string,
  initialBookmarked: boolean,
  currentUserId: string
) {
  const supabase = createSupabaseBrowserClient()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)

  const toggleBookmark = async () => {
    setBookmarked((prev) => !prev) // optimistic update

    const { error } = bookmarked
      ? await supabase
          .from("itinerary_bookmarks")
          .delete()
          .eq("itinerary_id", itineraryId)
          .eq("account_id", currentUserId)
      : await supabase
          .from("itinerary_bookmarks")
          .insert({
            itinerary_id: itineraryId,
            account_id: currentUserId,
          })

    if (error) {
      console.error("Bookmark error:", error)
      setBookmarked((prev) => !prev) // rollback
    }
  }

  return {
    bookmarked,
    toggleBookmark,
  }
}

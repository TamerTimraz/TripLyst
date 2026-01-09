"use client"

import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookmark } from "@/lib/use-bookmark"

type BookmarkButtonProps = {
  itineraryId: string
  isBookmarked: boolean
  currentUserId: string
}

export function BookmarkButton({
  itineraryId,
  isBookmarked,
  currentUserId,
}: BookmarkButtonProps) {
  const { bookmarked, toggleBookmark } = useBookmark(itineraryId, isBookmarked, currentUserId)

  return (
    <Button
      className="w-full gap-2 bg-background hover:bg-muted/30 hover:text-foreground cursor-pointer"
      size="lg"
      variant="outline"
      onClick={toggleBookmark}
    >
      <Bookmark
        className={bookmarked ? "h-4 w-4 text-yellow-300" : "h-4 w-4"}
        fill={bookmarked ? "currentColor" : "none"}
      />
      {bookmarked ? "Bookmarked" : "Bookmark Itinerary"}
    </Button>
  )
}

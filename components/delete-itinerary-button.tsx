"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteItinerary } from "@/app/itineraries/actions"
import { useTransition } from "react"

export function DeleteItineraryButton({ itineraryId }: { itineraryId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      size="lg"
      className="w-full gap-2 cursor-pointer"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          deleteItinerary(itineraryId)
        })
      }
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete Itinerary"}
    </Button>
  )
}

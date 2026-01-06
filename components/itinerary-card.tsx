"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Bookmark, Heart } from "lucide-react"
import Image from "next/image"
import { ItineraryListItemWithUser } from "@/types"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useState } from "react"

type ItineraryCardProps = ItineraryListItemWithUser

export function ItineraryCard({ id, title, destination, start_date, end_date, created_at, author, is_bookmarked, current_user_id }: ItineraryCardProps) {
  const supabase = createSupabaseBrowserClient()

  const [bookmarked, setBookmarked] = useState(is_bookmarked)
  
  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setBookmarked((prev) => !prev) // optimistic update

    const { error } = bookmarked
      ? await supabase
          .from("itinerary_bookmarks")
          .delete()
          .eq("itinerary_id", id)
          .eq("account_id", current_user_id)
      : await supabase.from("itinerary_bookmarks").insert({
          itinerary_id: id,
          account_id: current_user_id,
        })

    if (error) {
      console.error("Bookmark error:", error)
      setBookmarked((prev) => !prev) // rollback on failure
    }
  }

  return (
    <Link href={`/itineraries/${id}`} className="no-underline">
      <Card className="group overflow-hidden bg-card hover:shadow-md transition-all duration-300 border border-border/50">
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={"/images/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-2 text-white">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src={"/placeholder.svg"} alt={author.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium drop-shadow-sm">
                {author.name}
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleBookmark}
              className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <Bookmark className={bookmarked ? "h-4 w-4 text-yellow-300" : "h-4 w-4"} fill={bookmarked ? "yellow": "none"} />
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight text-balance text-foreground mb-2">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5" />
              <span>{destination}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(start_date).toLocaleDateString()} -{" "}
                {new Date(end_date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created on {new Date(created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Heart, Bookmark, Share2, Clock, Lock } from "lucide-react"
import Image from "next/image"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ItineraryWithSchedule } from "@/types"
import { redirect, notFound } from "next/navigation"
import { formatDate, formatDateNum } from "@/lib/utils"

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  function isValidUUID(id: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  }

  if (!isValidUUID(id)) {
    notFound()
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("itineraries")
    .select(`
    *,
    itinerary_days (
      *,
      activities (*)
    ),
    author:accounts (*)
    `)
    .eq("id", id)
    .order("day_index", { referencedTable: "itinerary_days", ascending: true })
    .order("position", {
      referencedTable: "itinerary_days.activities",
      ascending: true,
    })
    .maybeSingle<ItineraryWithSchedule>()
  
  if (error) {
    console.error("Error fetching itinerary:", error.message)
    throw new Error("Failed to fetch itinerary")
  }

  // If no Itinerary is returned (private itinerary), redirect to home page
  if (!data) {
    redirect("/home")
  }

  const duration =
    Math.ceil(
      (new Date(data.end_date).getTime() -
        new Date(data.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1

  const itinerary = { ...data }

  //console.log(itinerary)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-100 w-full">
        <Image
          src={itinerary.image_url || "/images/placeholder.jpg"}
          alt={itinerary.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="text-white space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{itinerary.destination}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                {itinerary.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDateNum(itinerary.start_date)} -{" "}
                    {formatDateNum(itinerary.end_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {itinerary.description && (
              <Card className="p-6 border-border/50">
                <h2 className="text-2xl font-semibold mb-4">About this trip</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {itinerary.description}
                </p>
              </Card>
            )}
            {/* Itinerary Days */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Itinerary</h2>
                {itinerary.visibility === "private" && <Lock/>}
              </div>
              {itinerary.itinerary_days.map((day) => (
                <Card key={day.id} className="p-6 border-border/50">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge
                      variant="secondary"
                      className="h-10 w-10 rounded-full flex items-center justify-center text-base font-semibold bg-primary/10 text-primary border-0"
                    >
                      {day.day_index + 1}
                    </Badge>
                    <h3 className="text-xl font-semibold">
                      Day {day.day_index + 1}: {formatDate(day.date)}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          {idx < day.activities.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-2" />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="font-semibold text-foreground">
                              {activity.title}
                            </h4>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card className="p-6 border-border/50 top-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={itinerary.author.image_url || undefined}
                      alt={itinerary.author.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {itinerary.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <p className="font-semibold">{itinerary.author.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="w-full" size="lg">
                  Save Itinerary
                </Button>
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-4">Trip Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium">
                    {formatDateNum(itinerary.start_date)} -{" "}
                    {formatDateNum(itinerary.end_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{duration} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-medium">
                    {itinerary.itinerary_days.reduce(
                      (acc, day) => acc + day.activities.length,
                      0
                    )}{" "}
                    planned
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

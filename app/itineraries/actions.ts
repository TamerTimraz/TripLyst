"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

interface CreateItineraryInput {
  title: string
  description: string | null
  destination: string
  startDate: string
  endDate: string
  visibility: "public" | "private"
  days: {
    date: string
    activities: {
      title: string
      description: string | null
    }[]
  }[]
}

export async function createItinerary(input: CreateItineraryInput) {
  const supabase = await createSupabaseServerClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Insert itinerary data in database
  const { data: itineraryId, error } = await supabase.rpc(
    "create_itinerary_with_days_and_activities",
    {
      p_account_id: user.id,
      p_title: input.title,
      p_description: input.description,
      p_destination: input.destination,
      p_start_date: input.startDate,
      p_end_date: input.endDate,
      p_visibility: input.visibility,
      p_days: input.days.map((day) => ({
        date: day.date,
        activities: day.activities.map((activity, index) => ({
          title: activity.title,
          description: activity.description,
          position: index,
        })),
      })),
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return itineraryId
}

export async function updateItineraryImage(
  itineraryId: string,
  imageUrl: string
) {
  const supabase = await createSupabaseServerClient()

  await supabase
    .from("itineraries")
    .update({ image_url: imageUrl })
    .eq("id", itineraryId)
}

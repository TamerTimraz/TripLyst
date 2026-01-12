import { createSupabaseBrowserClient } from "../supabase/client"

export async function uploadProfileImage(file: File, accountId: string) {
    const supabase = createSupabaseBrowserClient()

    const filePath = `${accountId}/profilePic.${file.name.split(".").pop()}`

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, { upsert: true })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath)

    return `${data.publicUrl}?v=${Date.now()}`
}

export async function uploadItineraryImage(file: File, itineraryId: string) {
  const filePath = `${itineraryId}/cover.${file.name.split(".").pop()}`

  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.storage
    .from("itinerary-images")
    .upload(filePath, file, { upsert: true })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage
    .from("itinerary-images")
    .getPublicUrl(filePath)

  return data.publicUrl
}
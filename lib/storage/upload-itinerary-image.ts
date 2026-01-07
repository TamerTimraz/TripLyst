import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function uploadItineraryImage(file: File, itineraryId: string) {
    const filePath = `${itineraryId}/cover.${file.name.split('.').pop()}`

    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.storage.from("itinerary-images").upload(filePath, file, { upsert: true }) 

    if (error) {
        throw new Error(error.message)
    }

    const { data } = supabase.storage.from("itinerary-images").getPublicUrl(filePath)

    return data.publicUrl
}
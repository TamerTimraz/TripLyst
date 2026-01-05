import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ItineraryWithAccount } from "@/types"
import MyItinerariesClient from "./my-itineraries-client"

export default async function MyItineraries() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: myItineraries, error } = await supabase
    .from("itineraries")
    .select(
      `
      *,
      accounts (name, email)`
    )
    .eq("account_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<ItineraryWithAccount[]>()

  if (error) {
    console.error("Error fetching itineraries:", error.message)
    throw new Error("Failed to fetch itineraries")
  }

  return (
    <MyItinerariesClient myItineraries={myItineraries || []} />
  )
}

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import SignOutButton from "./SignOutButton"

export default async function Home() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as {user.email}</p>
      <SignOutButton />
    </div>
  )
}

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Account } from "@/types"
import AccountClient from "../account/account-client"

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", user.id)
    .single<Account>()

  if (error) {
    console.error("Error fetching account:", error.message)
    throw new Error("Failed to fetch account")
  }

  const id = account.id
  const name = account.name
  const email = account.email
  const image_url = account.image_url
  const dateJoined = new Date(account.created_at).toLocaleDateString()

  return (
    <AccountClient
      account_id={id}
      account_name={name}
      account_email={email}
      image_url={image_url}
      dateJoined={dateJoined}
    />
  )
}

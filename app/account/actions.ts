"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

interface UpdateAccountInput {
    name: string | null
    imageUrl: string | null
}

export async function updateAccount(input: UpdateAccountInput) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  if (input.name && input.imageUrl) {
    await supabase
      .from("accounts")
      .update({ name: input.name, image_url: input.imageUrl })
      .eq("id", user.id)
  } else if (input.name) {
    await supabase
      .from("accounts")
      .update({ name: input.name })
      .eq("id", user.id)
  } else {
    await supabase
      .from("accounts")
      .update({ image_url: input.imageUrl })
      .eq("id", user.id)
  }
}
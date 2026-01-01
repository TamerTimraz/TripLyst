"use client"

import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function useAuth() {
  const supabase = createSupabaseBrowserClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signOut }
}

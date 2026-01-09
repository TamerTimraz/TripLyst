"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Lock } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Props = {
  itineraryId: string
  initialVisibility: string
}

export function VisibilityToggleButton({
  itineraryId,
  initialVisibility,
}: Props) {
  const [visibility, setVisibility] = useState(initialVisibility)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleVisibility = async () => {
    const next = visibility === "public" ? "private" : "public"

    setVisibility(next) // optimistic
    setLoading(true)

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase
      .from("itineraries")
      .update({ visibility: next })
      .eq("id", itineraryId)

    if (error) {
      console.error(error)
      setVisibility(visibility) // rollback
    } else {
      router.refresh() // sync server state
    }

    setLoading(false)
  }

  return (
    <Button
      className="w-full gap-2 bg-background hover:bg-muted/30 hover:text-foreground cursor-pointer"
      size="lg"
      variant="outline"
      onClick={toggleVisibility}
      disabled={loading}
    >
      {visibility === "public" ? (
        <>
          <Globe className="h-4 w-4" />
          Public
          <span className="ml-auto text-xs text-muted-foreground">
            Click to make private
          </span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Private
          <span className="ml-auto text-xs text-muted-foreground">
            Click to make public
          </span>
        </>
      )}
    </Button>
  )
}

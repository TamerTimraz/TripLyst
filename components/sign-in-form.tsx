"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { useAuthModal } from "@/components/auth-modal-context"

export function SignInForm() {
  const supabase = createSupabaseBrowserClient()
  const { close } = useAuthModal()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    // Supabase sign in
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setIsLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Signed in successfully!")
    close()
    redirect("/home")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Welcome Back</h2>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  )
}

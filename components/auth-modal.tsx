"use client"

import { useAuthModal } from "./auth-modal-context"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { X } from "lucide-react"

export function AuthModal() {
  const { mode, close, openSignIn, openSignUp } = useAuthModal()

  if (!mode) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
        <X size={20} />
        </button>

        {mode === "signin" && (
          <>
            <SignInForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <button
                onClick={openSignUp}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <SignUpForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                onClick={openSignIn}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

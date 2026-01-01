"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { SignInForm } from "@/components/sign-in-form"
import { SignUpForm } from "@/components/sign-up-form"

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<"none" | "signin" | "signup">("none")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onSignInClick={() => setAuthModal("signin")} onSignUpClick={() => setAuthModal("signup")} />

      {/* Auth Modal */}
      {authModal !== "none" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setAuthModal("none")}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>

            {authModal === "signin" && (
              <>
                <SignInForm />
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{" "}
                  <button onClick={() => setAuthModal("signup")} className="text-primary font-semibold hover:underline">
                    Sign up
                  </button>
                </p>
              </>
            )}

            {authModal === "signup" && (
              <>
                <SignUpForm />
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <button onClick={() => setAuthModal("signin")} className="text-primary font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <main>
        <HeroSection onGetStarted={() => setAuthModal("signup")} />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">© 2025 TripLyst. Craft your perfect journey.</p>
        </div>
      </footer>
    </div>
  )
}

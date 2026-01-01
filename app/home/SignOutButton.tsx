"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.refresh();
      router.push("/");
    }
  };

  return <button className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-700 transition cursor-pointer" onClick={signOut}>Sign Out</button>;
}
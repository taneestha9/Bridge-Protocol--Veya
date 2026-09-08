"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.session) {
        await fetch("/api/profile/bootstrap", { method: "POST" })
        router.push("/participate")
      } else {
        setMessage("Check your email to confirm your account, then return to sign in.")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
      } else {
        const response = await fetch("/api/profile/bootstrap", { method: "POST" })

        if (!response.ok) {
          setError("Signed in, but we could not load your Bridge profile.")
        } else {
          const data = await response.json()
          const membership = data.memberships?.[0]

          if (membership?.organization?.slug) {
            router.push(`/${membership.organization.slug}/cases`)
          } else {
            router.push("/workspace")
          }
        }
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      {mode === "signup" && (
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400"
          />
        </label>
      )}

      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400"
        />
      </label>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
      </Button>
    </form>
  )
}

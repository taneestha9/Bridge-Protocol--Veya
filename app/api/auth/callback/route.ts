import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getOrCreateDbUser } from "@/lib/auth"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
    await getOrCreateDbUser()
  }

  return NextResponse.redirect(new URL("/onboarding", requestUrl.origin))
}

import Link from "next/link"
import { getCurrentUserWithMemberships } from "@/lib/auth"

export async function SiteNav() {
  const user = await getCurrentUserWithMemberships()
  const membership = user?.memberships?.[0]
  const chapterSlug = membership?.organization?.slug

  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-navy">
          veya
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-slate-600">
          <Link href="/explore" className="hover:text-navy">Explore</Link>
          <Link href="/chapters" className="hover:text-navy">Chapters</Link>
          <Link href="/docs" className="hover:text-navy">Protocol</Link>
          <Link href="/participate" className="hover:text-navy">Participate</Link>

          {chapterSlug ? (
            <Link href={`/${chapterSlug}/cases`} className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-navy">
              My Chapter
            </Link>
          ) : user ? (
            <Link href="/workspace" className="rounded-xl bg-navy px-4 py-2 font-semibold text-white">
              My Workspace
            </Link>
          ) : (
            <Link href="/login" className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-navy">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

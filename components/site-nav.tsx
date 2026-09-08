import Link from "next/link"

export function SiteNav() {
  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-navy">veya</Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/dashboard" className="hover:text-navy">Network</Link>
          <Link href="/chapters" className="hover:text-navy">Chapters</Link>
          <Link href="/docs" className="hover:text-navy">Docs</Link>
          <Link href="/login" className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-navy">Sign in</Link>
        </nav>
      </div>
    </header>
  )
}

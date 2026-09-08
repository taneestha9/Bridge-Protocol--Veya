import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export default function Page() {
  return <><SiteNav /><main className="container-page max-w-3xl py-16"><Link href="/docs" className="text-sm text-slate-500">← Documentation</Link><p className="eyebrow mt-8">Bridge Protocol v1.0</p><h1 className="mt-2 text-4xl font-bold">API reference</h1><p className="mt-6 text-lg leading-8 text-slate-600">The MVP exposes organization-scoped REST-style route handlers under /api/orgs/:orgId. Routes cover beneficiaries, volunteers, donors, cases, matches and analytics. Every private route checks authenticated membership before accessing tenant data.</p></main></>
}

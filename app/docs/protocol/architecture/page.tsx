import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export default function Page() {
  return <><SiteNav /><main className="container-page max-w-3xl py-16"><Link href="/docs" className="text-sm text-slate-500">← Documentation</Link><p className="eyebrow mt-8">Bridge Protocol v1.0</p><h1 className="mt-2 text-4xl font-bold">Three-layer architecture</h1><p className="mt-6 text-lg leading-8 text-slate-600">Network organizations operate through the Protocol Layer, which defines verification, matching, safeguards, data standards, lifecycle and transparency; the Software Layer implements those rules through case management, volunteers, beneficiaries, donors, analytics, administration and APIs.</p></main></>
}

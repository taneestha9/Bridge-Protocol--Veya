import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export default function Page() {
  return <><SiteNav /><main className="container-page max-w-3xl py-16"><Link href="/docs" className="text-sm text-slate-500">← Documentation</Link><p className="eyebrow mt-8">Bridge Protocol v1.0</p><h1 className="mt-2 text-4xl font-bold">Safeguarding</h1><p className="mt-6 text-lg leading-8 text-slate-600">Chapters must not exploit beneficiaries, discriminate unlawfully, falsify cases, misuse personal information, pressure beneficiaries, publish unauthorized material, or use welfare operations for unrelated political or commercial activity.</p></main></>
}

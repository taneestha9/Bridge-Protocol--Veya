import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export default function Page() {
  return <><SiteNav /><main className="container-page max-w-3xl py-16"><Link href="/docs" className="text-sm text-slate-500">← Documentation</Link><p className="eyebrow mt-8">Bridge Protocol v1.0</p><h1 className="mt-2 text-4xl font-bold">Getting started</h1><p className="mt-6 text-lg leading-8 text-slate-600">Create an account, create a chapter, configure the workspace, invite the team, add volunteers and beneficiaries, create the first case, verify it, generate match recommendations, approve a match and close the case.</p></main></>
}

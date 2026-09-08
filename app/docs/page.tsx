import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

const docs = [
  ["Protocol overview", "/docs/protocol/overview"],
  ["Architecture", "/docs/protocol/architecture"],
  ["Verification", "/docs/protocol/verification"],
  ["Case lifecycle", "/docs/protocol/case-lifecycle"],
  ["Safeguarding", "/docs/protocol/safeguarding"],
  ["Data & privacy", "/docs/protocol/data-privacy"],
  ["Getting started", "/docs/getting-started"],
  ["API reference", "/docs/api"]
]

export default function Docs() {
  return <><SiteNav /><main className="container-page py-14"><p className="eyebrow">Documentation</p><h1 className="mt-2 text-4xl font-bold">Bridge Protocol documentation</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{docs.map(([a,b]) => <Link href={b} key={b} className="card p-6"><p className="font-semibold">{a}</p><p className="mt-2 text-sm text-slate-500">Read the public specification and implementation guidance.</p></Link>)}</div></main></>
}

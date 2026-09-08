import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return <>
    <SiteNav />
    <main>
      <section className="container-page grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Bridge Protocol · V1.0</p>
          <h1 className="mt-5 text-5xl font-bold tracking-tight text-navy lg:text-6xl">Open infrastructure for grassroots welfare coordination.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Local organizations know their communities. Bridge provides the shared infrastructure that helps them coordinate beneficiaries, volunteers, cases and resources responsibly.</p>
          <div className="mt-8 flex gap-3">
            <Link href="/onboarding" className="rounded-xl bg-navy px-5 py-3 font-semibold text-white">Start a chapter</Link>
            <Link href="/docs" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-navy">Read the protocol</Link>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="rounded-2xl bg-navy p-8 text-white">
            <p className="text-sm uppercase tracking-[0.2em] opacity-70">Three-layer architecture</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-white/10 p-5"><b>Network</b><p className="mt-1 text-sm opacity-75">Chapters · NGOs · Communities</p></div>
              <div className="rounded-xl bg-white/10 p-5"><b>Protocol</b><p className="mt-1 text-sm opacity-75">Verification · Matching · Standards</p></div>
              <div className="rounded-xl bg-white/10 p-5"><b>Software</b><p className="mt-1 text-sm opacity-75">Cases · Volunteers · Analytics</p></div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page grid gap-5 py-16 md:grid-cols-3">
        {[
          ["Operate locally", "Independent organizations own the work on the ground."],
          ["Coordinate consistently", "A shared protocol creates common language and safeguards."],
          ["Measure honestly", "Aggregate activity becomes visible without exposing people."]
        ].map(([title, body]) => <Card key={title}><CardContent><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 text-slate-600">{body}</p></CardContent></Card>)}
      </section>
    </main>
  </>
}

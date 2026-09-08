import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export default function ExplorePage() {
  return (
    <>
      <SiteNav />
      <main className="container-page py-16">
        <p className="eyebrow">Public network</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Explore Bridge.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Discover participating organizations, chapters and opportunities without accessing private operational data.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Link href="/chapters" className="card p-6 hover:shadow-md">
            <h2 className="text-xl font-semibold text-navy">Chapters</h2>
            <p className="mt-2 text-slate-600">Explore local operating units and their public service areas.</p>
          </Link>
          <Link href="/dashboard" className="card p-6 hover:shadow-md">
            <h2 className="text-xl font-semibold text-navy">Network activity</h2>
            <p className="mt-2 text-slate-600">View aggregate activity and network-level metrics.</p>
          </Link>
          <Link href="/docs" className="card p-6 hover:shadow-md">
            <h2 className="text-xl font-semibold text-navy">Protocol</h2>
            <p className="mt-2 text-slate-600">Read the standards behind verification, matching and safeguarding.</p>
          </Link>
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <p className="eyebrow">Privacy by design</p>
          <h2 className="mt-3 text-2xl font-semibold text-navy">Public discovery is not public case access.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Public pages can show aggregate activity and approved organizational information. Beneficiary identities and sensitive case information remain private.
          </p>
        </div>
      </main>
    </>
  )
}

import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { ParticipationCard } from "@/components/participation-card"

const principles = [
  ["Operate locally", "Independent organizations and communities remain responsible for ground operations."],
  ["Coordinate consistently", "A shared protocol gives people and organizations common standards for verification, matching and case coordination."],
  ["Protect people", "Private operational information stays private while the public network can still show defensible aggregate activity."],
]

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="container-page grid gap-12 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-28">
          <div>
            <p className="eyebrow">Veya · Bridge Protocol</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-navy lg:text-7xl">
              Infrastructure for communities that help communities.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Bridge connects people, organizations, resources and local action through an open coordination network.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/explore" className="rounded-xl bg-navy px-5 py-3 font-semibold text-white">
                Explore the network
              </Link>
              <Link href="/participate" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-navy">
                I want to participate
              </Link>
              <Link href="/docs" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-navy">
                How Bridge works
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="rounded-3xl bg-navy p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                One network · three layers
              </p>
              <div className="mt-7 space-y-3">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold">Network</p>
                  <p className="mt-1 text-sm text-white/70">Organizations · chapters · people · resources</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold">Protocol</p>
                  <p className="mt-1 text-sm text-white/70">Verification · matching · safeguards · standards</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="font-semibold">Software</p>
                  <p className="mt-1 text-sm text-white/70">Cases · coordination · analytics · APIs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-page py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map(([title, body]) => (
              <div key={title} className="card p-6">
                <h2 className="text-xl font-semibold text-navy">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-16">
          <div className="max-w-3xl">
            <p className="eyebrow">Find your way in</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Bridge should meet you where you are.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              You do not need to create a chapter to explore Bridge, volunteer, provide resources, join an existing chapter, or request support.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/participate" className="card p-6 hover:shadow-md">
              <h3 className="font-semibold text-navy">I want to help</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Volunteer, provide resources, or connect with a local chapter.</p>
            </Link>
            <Link href="/organization" className="card p-6 hover:shadow-md">
              <h3 className="font-semibold text-navy">I represent an organization</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Build an organization workspace and, when appropriate, operate chapters.</p>
            </Link>
            <Link href="/request-support" className="card p-6 hover:shadow-md">
              <h3 className="font-semibold text-navy">I need support</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Submit a request or find an appropriate route into the network.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

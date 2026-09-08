import { SiteNav } from "@/components/site-nav"

export default function VolunteerPage() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-3xl py-16">
        <p className="eyebrow">Volunteer</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Contribute your time and skills.</h1>
        <p className="mt-4 leading-7 text-slate-600">
          The volunteer profile will capture only what is needed to discover and coordinate appropriate opportunities.
        </p>

        <form className="card mt-10 space-y-5 p-6">
          <label className="block text-sm font-medium">Location
            <input className="mt-1 w-full rounded-xl border border-slate-200 p-3" placeholder="City / service area" />
          </label>
          <label className="block text-sm font-medium">Skills
            <input className="mt-1 w-full rounded-xl border border-slate-200 p-3" placeholder="e.g. tutoring, logistics, translation" />
          </label>
          <label className="block text-sm font-medium">Availability
            <textarea className="mt-1 w-full rounded-xl border border-slate-200 p-3" rows={3} placeholder="When are you generally available?" />
          </label>
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            This page is the first frontend shell. Persistence should be wired to the volunteer API only after the identity and role model migration is applied.
          </p>
        </form>
      </main>
    </>
  )
}

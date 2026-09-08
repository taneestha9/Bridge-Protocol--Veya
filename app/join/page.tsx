import { SiteNav } from "@/components/site-nav"

export default function JoinPage() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-3xl py-16">
        <p className="eyebrow">Join a chapter</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Find an existing local chapter.</h1>
        <p className="mt-4 leading-7 text-slate-600">
          The final implementation will let you search participating chapters by location and service area, then request to join where the chapter accepts members.
        </p>
        <div className="card mt-10 p-6">
          <p className="font-semibold text-navy">Next backend dependency</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This flow depends on the Chapter and ChapterMembership models defined in the locked architecture.
          </p>
        </div>
      </main>
    </>
  )
}

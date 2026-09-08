import { SiteNav } from "@/components/site-nav"
import { ParticipationCard } from "@/components/participation-card"

export default function ParticipatePage() {
  return (
    <>
      <SiteNav />
      <main className="container-page py-16">
        <p className="eyebrow">Participate</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">How would you like to participate?</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Choose a path that matches what you are trying to do. You can change how you participate later.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <ParticipationCard href="/volunteer" title="Volunteer" body="Offer your time, skills or expertise and discover opportunities with participating chapters." eyebrow="People" />
          <ParticipationCard href="/join" title="Join an existing chapter" body="Find a local chapter and request to participate without creating a new one." eyebrow="People" />
          <ParticipationCard href="/provider" title="Provide resources" body="Offer funding, goods, services, expertise, logistics or institutional resources." eyebrow="Resources" />
          <ParticipationCard href="/organization" title="Represent an organization" body="Create an organization workspace and operate local chapters where appropriate." eyebrow="Organizations" />
          <ParticipationCard href="/request-support" title="Request support" body="Submit a support request, referral or assisted request through a privacy-conscious workflow." eyebrow="Support" />
          <ParticipationCard href="/explore" title="Just explore" body="Learn how Bridge works and explore the public network before deciding how to participate." eyebrow="No commitment" />
        </div>
      </main>
    </>
  )
}

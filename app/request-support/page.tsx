import { SiteNav } from "@/components/site-nav"

export default function RequestSupportPage() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-3xl py-16">
        <p className="eyebrow">Support</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Request support.</h1>
        <p className="mt-4 leading-7 text-slate-600">
          A support request can be submitted directly, through a referral, or with assistance from an authorized organization.
        </p>

        <div className="card mt-10 p-6">
          <p className="font-semibold text-navy">Privacy first</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The final workflow will collect the minimum information necessary for routing and matching. Requests and beneficiary information are never public by default.
          </p>
          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              Before production, this flow requires the formal consent, safeguarding and support-request data model.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

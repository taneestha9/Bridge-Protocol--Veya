import { SiteNav } from "@/components/site-nav"

export default function ProviderPage() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-3xl py-16">
        <p className="eyebrow">Resource provider</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Offer something useful.</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Providers can offer funding, goods, services, expertise, logistics, facilities or institutional support without becoming a chapter.
        </p>

        <form className="card mt-10 space-y-5 p-6">
          <label className="block text-sm font-medium">Provider name
            <input className="mt-1 w-full rounded-xl border border-slate-200 p-3" />
          </label>
          <label className="block text-sm font-medium">Resource type
            <select className="mt-1 w-full rounded-xl border border-slate-200 p-3">
              <option>Funding</option>
              <option>Goods</option>
              <option>Services</option>
              <option>Professional expertise</option>
              <option>Logistics</option>
              <option>Facilities / equipment</option>
              <option>Institutional support</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Service area
            <input className="mt-1 w-full rounded-xl border border-slate-200 p-3" placeholder="City / region / country" />
          </label>
        </form>
      </main>
    </>
  )
}

import Link from "next/link"

export function OrgHeader({ org, active }: { org: { name: string; city: string; country: string; slug: string }; active: string }) {
  const links = [
    ["cases", "Cases"], ["beneficiaries", "Beneficiaries"], ["volunteers", "Volunteers"],
    ["matching", "Matching"], ["analytics", "Analytics"]
  ]
  return <div className="border-b border-slate-200 bg-white">
    <div className="container-page py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xl font-bold text-navy">{org.name}</p><p className="text-sm text-slate-500">{org.city}, {org.country}</p></div>
        <Link href="/" className="text-sm text-slate-500">Bridge Protocol</Link>
      </div>
      <nav className="mt-5 flex gap-2 overflow-x-auto">
        {links.map(([key, label]) => <Link key={key} href={`/${org.slug}/${key}`} className={`rounded-lg px-3 py-2 text-sm font-medium ${active === key ? "bg-slate-100 text-navy" : "text-slate-500"}`}>{label}</Link>)}
      </nav>
    </div>
  </div>
}

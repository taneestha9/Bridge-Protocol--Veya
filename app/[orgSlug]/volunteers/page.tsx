import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithMemberships } from "@/lib/auth"
import { OrgHeader } from "@/components/org-header"

export default async function Volunteers({ params }: { params: { orgSlug: string } }) {
  const user = await getCurrentUserWithMemberships()
  const org = await prisma.organization.findUnique({ where: { slug: params.orgSlug } })
  if (!user || !org || !user.memberships.some(m => m.organizationId === org.id)) redirect("/login")
  const rows = await prisma.volunteer.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: "desc" } })
  return <><OrgHeader org={org} active="volunteers" /><main className="container-page py-10"><p className="eyebrow">People</p><h1 className="mt-2 text-3xl font-bold">Volunteers</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{rows.map(r => <div key={r.id} className="card p-5"><div className="flex justify-between"><h2 className="font-semibold">{r.name}</h2><span className="text-xs uppercase text-slate-500">{r.status}</span></div><p className="mt-2 text-sm text-slate-500">{r.location}</p><div className="mt-4 flex flex-wrap gap-2">{r.skills.map(s => <span key={s} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{s}</span>)}</div><p className="mt-4 text-xs text-slate-500">Reliability {r.reliabilityScore.toFixed(1)} · Deliveries {r.deliveryCount}</p></div>)}</div></main></>
}

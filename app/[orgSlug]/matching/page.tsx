import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithMemberships } from "@/lib/auth"
import { OrgHeader } from "@/components/org-header"

export default async function Matching({ params }: { params: { orgSlug: string } }) {
  const user = await getCurrentUserWithMemberships()
  const org = await prisma.organization.findUnique({ where: { slug: params.orgSlug } })
  if (!user || !org || !user.memberships.some(m => m.organizationId === org.id)) redirect("/login")
  const matches = await prisma.match.findMany({
    where: { case: { organizationId: org.id } },
    include: { volunteer: { select: { name: true } }, case: { select: { title: true, status: true } } },
    orderBy: { matchScore: "desc" }
  })
  return <><OrgHeader org={org} active="matching" /><main className="container-page py-10"><p className="eyebrow">Human-in-the-loop matching</p><h1 className="mt-2 text-3xl font-bold">Match recommendations</h1><p className="mt-3 max-w-2xl text-slate-600">Bridge recommends; a coordinator approves. Generate recommendations through POST /api/orgs/{org.id}/matches.</p><div className="mt-8 space-y-3">{matches.map(m => <div key={m.id} className="card flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold">{m.case.title}</p><p className="text-sm text-slate-500">{m.volunteer?.name ?? "No volunteer"} · {m.status}</p></div><div className="text-right"><p className="text-2xl font-bold text-navy">{Math.round(m.matchScore ?? 0)}</p><p className="text-xs text-slate-500">match score</p></div></div>)}</div></main></>
}

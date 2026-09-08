import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithMemberships } from "@/lib/auth"
import { OrgHeader } from "@/components/org-header"
import { CaseLifecycle } from "@/components/case-lifecycle"

export default async function CasesPage({ params }: { params: { orgSlug: string } }) {
  const user = await getCurrentUserWithMemberships()
  const org = await prisma.organization.findUnique({ where: { slug: params.orgSlug } })
  if (!user || !org || !user.memberships.some(m => m.organizationId === org.id)) redirect("/login")
  const cases = await prisma.case.findMany({
    where: { organizationId: org.id },
    include: { beneficiary: { select: { name: true, residentId: true } }, volunteer: { select: { name: true } } },
    orderBy: { updatedAt: "desc" }
  })
  return <>
    <OrgHeader org={org} active="cases" />
    <main className="container-page py-10">
      <div className="flex items-end justify-between"><div><p className="eyebrow">Case management</p><h1 className="mt-2 text-3xl font-bold">Cases</h1></div><p className="text-sm text-slate-500">{cases.length} total</p></div>
      <div className="mt-8 space-y-4">
        {cases.map(c => <div key={c.id} className="card p-5">
          <div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{c.title}</p><p className="text-sm text-slate-500">{c.beneficiary.name} · {c.category}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">{c.urgency}</span></div>
          <CaseLifecycle currentStatus={c.status} />
          <p className="text-sm text-slate-600">Assigned: {c.volunteer?.name ?? "Unassigned"} · Verification level: {c.verificationLevel}</p>
        </div>)}
        {cases.length === 0 && <div className="card p-10 text-center text-slate-500">No cases yet. Create your first case through the API or the next UI iteration.</div>}
      </div>
    </main>
  </>
}

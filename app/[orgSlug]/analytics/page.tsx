import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithMemberships } from "@/lib/auth"
import { OrgHeader } from "@/components/org-header"

export default async function Analytics({ params }: { params: { orgSlug: string } }) {
  const user = await getCurrentUserWithMemberships()
  const org = await prisma.organization.findUnique({ where: { slug: params.orgSlug } })
  if (!user || !org || !user.memberships.some(m => m.organizationId === org.id)) redirect("/login")
  const [cases, volunteers, beneficiaries, donors] = await Promise.all([
    prisma.case.count({ where: { organizationId: org.id } }),
    prisma.volunteer.count({ where: { organizationId: org.id, status: "active" } }),
    prisma.beneficiary.count({ where: { organizationId: org.id } }),
    prisma.donor.count({ where: { organizationId: org.id } })
  ])
  return <><OrgHeader org={org} active="analytics" /><main className="container-page py-10"><p className="eyebrow">Impact</p><h1 className="mt-2 text-3xl font-bold">Chapter analytics</h1><div className="mt-8 grid gap-4 md:grid-cols-4">{[["Cases",cases],["Active volunteers",volunteers],["Beneficiaries",beneficiaries],["Donors",donors]].map(([a,b])=><div key={a} className="card p-6"><p className="text-sm text-slate-500">{a}</p><p className="mt-2 text-3xl font-bold">{b}</p></div>)}</div></main></>
}

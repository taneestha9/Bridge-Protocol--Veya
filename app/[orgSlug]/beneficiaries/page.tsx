import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithMemberships } from "@/lib/auth"
import { OrgHeader } from "@/components/org-header"

export default async function Beneficiaries({ params }: { params: { orgSlug: string } }) {
  const user = await getCurrentUserWithMemberships()
  const org = await prisma.organization.findUnique({ where: { slug: params.orgSlug } })
  if (!user || !org || !user.memberships.some(m => m.organizationId === org.id)) redirect("/login")
  const rows = await prisma.beneficiary.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: "desc" } })
  return <><OrgHeader org={org} active="beneficiaries" /><main className="container-page py-10"><p className="eyebrow">People</p><h1 className="mt-2 text-3xl font-bold">Beneficiaries</h1><div className="mt-8 overflow-x-auto card"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="p-4">ID</th><th>Name</th><th>Location</th><th>Status</th></tr></thead><tbody>{rows.map(r => <tr key={r.id} className="border-b last:border-0"><td className="p-4 font-mono">{r.residentId}</td><td>{r.name}</td><td>{r.location}</td><td>{r.verificationStatus}</td></tr>)}</tbody></table></div></main></>
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"

export async function GET(_: Request, { params }: { params: { orgId: string } }) {
  try {
    await requireOrgAccess(params.orgId)
    const [cases, volunteers, beneficiaries, donors] = await Promise.all([
      prisma.case.groupBy({ by: ["status"], where: { organizationId: params.orgId }, _count: { _all: true } }),
      prisma.volunteer.count({ where: { organizationId: params.orgId, status: "active" } }),
      prisma.beneficiary.count({ where: { organizationId: params.orgId } }),
      prisma.donor.count({ where: { organizationId: params.orgId } })
    ])
    return NextResponse.json({
      cases: cases.map((x) => ({ status: x.status, count: x._count._all })),
      volunteers,
      beneficiaries,
      donors
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 })
  }
}

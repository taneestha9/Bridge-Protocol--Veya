import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"

export async function DELETE(_: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const existing = await prisma.match.findFirst({ where: { id: params.id, case: { organizationId: params.orgId } } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.match.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

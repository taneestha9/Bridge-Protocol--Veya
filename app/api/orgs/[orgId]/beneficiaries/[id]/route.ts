import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"
import { logActivity } from "@/lib/audit"
import { z } from "zod"

const patchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().max(40).nullable().optional(),
  location: z.string().min(2).max(200).optional(),
  notes: z.string().max(3000).nullable().optional(),
  verificationStatus: z.enum(["pending", "reviewed", "verified", "flagged"]).optional()
})

export async function PATCH(req: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const existing = await prisma.beneficiary.findFirst({ where: { id: params.id, organizationId: params.orgId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = patchSchema.parse(await req.json())
    const row = await prisma.beneficiary.update({ where: { id: params.id }, data: body })
    await logActivity({ organizationId: params.orgId, actorId: user.id, action: "beneficiary_updated", entityType: "beneficiary", entityId: row.id })
    return NextResponse.json(row)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin"])
    const existing = await prisma.beneficiary.findFirst({ where: { id: params.id, organizationId: params.orgId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.beneficiary.delete({ where: { id: params.id } })
    await logActivity({ organizationId: params.orgId, actorId: user.id, action: "beneficiary_deleted", entityType: "beneficiary", entityId: params.id })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

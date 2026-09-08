import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"
import { logActivity } from "@/lib/audit"
import { z } from "zod"

const schema = z.object({
  beneficiaryId: z.string().min(1),
  title: z.string().min(2).max(160),
  description: z.string().min(2).max(5000),
  category: z.string().min(2).max(60),
  urgency: z.enum(["green", "yellow", "red"]).default("green"),
  estimatedValue: z.number().nonnegative().optional()
})

export async function GET(_: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    await requireOrgAccess(params.orgId)
    const rows = await prisma.case.findMany({
      where: { organizationId: params.orgId },
      include: {
        beneficiary: { select: { id: true, residentId: true, name: true, location: true } },
        volunteer: { select: { id: true, name: true } },
        donor: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const body = schema.parse(await req.json())
    const beneficiary = await prisma.beneficiary.findFirst({
      where: { id: body.beneficiaryId, organizationId: params.orgId }
    })
    if (!beneficiary) return NextResponse.json({ error: "Beneficiary does not belong to this organization" }, { status: 400 })

    const row = await prisma.case.create({
      data: {
        organizationId: params.orgId,
        beneficiaryId: body.beneficiaryId,
        title: body.title,
        description: body.description,
        category: body.category,
        urgency: body.urgency,
        estimatedValue: body.estimatedValue
      },
      include: { beneficiary: true }
    })

    await prisma.caseAuditLog.create({
      data: {
        caseId: row.id,
        actorId: user.id,
        action: "case_created",
        previousState: null,
        newState: "submitted"
      }
    })
    await logActivity({ organizationId: params.orgId, actorId: user.id, action: "case_created", entityType: "case", entityId: row.id })
    return NextResponse.json(row, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

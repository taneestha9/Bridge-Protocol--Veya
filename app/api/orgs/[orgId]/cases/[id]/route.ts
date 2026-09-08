import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"
import { logActivity } from "@/lib/audit"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(2).max(160).optional(),
  description: z.string().min(2).max(5000).optional(),
  category: z.string().min(2).max(60).optional(),
  urgency: z.enum(["green", "yellow", "red"]).optional(),
  status: z.enum([
    "submitted","under_review","verified","open","matched","in_progress",
    "fulfilled","closed","rejected","cancelled","suspended"
  ]).optional(),
  verificationLevel: z.number().int().min(0).max(3).optional(),
  matchedVolunteerId: z.string().nullable().optional(),
  donorId: z.string().nullable().optional(),
  estimatedValue: z.number().nonnegative().nullable().optional()
})

export async function GET(_: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    await requireOrgAccess(params.orgId)
    const row = await prisma.case.findFirst({
      where: { id: params.id, organizationId: params.orgId },
      include: {
        beneficiary: true,
        volunteer: true,
        donor: true,
        matches: true,
        auditLogs: { orderBy: { createdAt: "desc" } }
      }
    })
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(row)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const existing = await prisma.case.findFirst({ where: { id: params.id, organizationId: params.orgId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = schema.parse(await req.json())

    if (body.matchedVolunteerId) {
      const volunteer = await prisma.volunteer.findFirst({
        where: { id: body.matchedVolunteerId, organizationId: params.orgId }
      })
      if (!volunteer) return NextResponse.json({ error: "Volunteer does not belong to this organization" }, { status: 400 })
    }

    const next = await prisma.case.update({
      where: { id: params.id },
      data: {
        ...body,
        completedAt: body.status === "fulfilled" || body.status === "closed" ? new Date() : existing.completedAt
      }
    })

    if (body.status && body.status !== existing.status) {
      await prisma.caseAuditLog.create({
        data: {
          caseId: existing.id,
          actorId: user.id,
          action: "status_changed",
          previousState: existing.status,
          newState: body.status
        }
      })
    }

    await logActivity({
      organizationId: params.orgId,
      actorId: user.id,
      action: "case_updated",
      entityType: "case",
      entityId: existing.id,
      metadata: body
    })

    return NextResponse.json(next)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin"])
    const existing = await prisma.case.findFirst({ where: { id: params.id, organizationId: params.orgId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.case.delete({ where: { id: params.id } })
    await logActivity({ organizationId: params.orgId, actorId: user.id, action: "case_deleted", entityType: "case", entityId: params.id })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"
import { findMatchesForCase } from "@/lib/matching"
import { logActivity } from "@/lib/audit"
import { z } from "zod"

const postSchema = z.object({ caseId: z.string().min(1) })
const patchSchema = z.object({
  matchId: z.string().min(1),
  status: z.enum(["approved", "rejected", "completed"])
})

export async function GET(_: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    await requireOrgAccess(params.orgId)
    const rows = await prisma.match.findMany({
      where: { case: { organizationId: params.orgId } },
      include: {
        volunteer: { select: { id: true, name: true } },
        case: { select: { id: true, title: true, status: true, beneficiary: { select: { name: true } } } }
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
    const { caseId } = postSchema.parse(await req.json())
    const target = await prisma.case.findFirst({ where: { id: caseId, organizationId: params.orgId } })
    if (!target) return NextResponse.json({ error: "Case not found" }, { status: 404 })

    const recommendations = await findMatchesForCase(caseId, params.orgId)

    await prisma.match.deleteMany({
      where: { caseId, status: "recommended" }
    })

    const stored = await prisma.$transaction(
      recommendations.map((rec) =>
        prisma.match.create({
          data: {
            caseId,
            volunteerId: rec.volunteerId,
            matchScore: rec.score,
            status: "recommended"
          }
        })
      )
    )

    await logActivity({
      organizationId: params.orgId,
      actorId: user.id,
      action: "match_recommendations_generated",
      entityType: "case",
      entityId: caseId
    })

    return NextResponse.json({ recommendations, stored })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const body = patchSchema.parse(await req.json())
    const match = await prisma.match.findFirst({
      where: { id: body.matchId, case: { organizationId: params.orgId } }
    })
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 })

    const updated = await prisma.$transaction(async (tx) => {
      const m = await tx.match.update({
        where: { id: match.id },
        data: { status: body.status, approvedBy: user.id }
      })

      if (body.status === "approved" && match.volunteerId) {
        await tx.case.update({
          where: { id: match.caseId },
          data: { matchedVolunteerId: match.volunteerId, status: "matched" }
        })
      }

      if (body.status === "completed") {
        await tx.case.update({
          where: { id: match.caseId },
          data: { status: "fulfilled", completedAt: new Date() }
        })
        if (match.volunteerId) {
          await tx.volunteer.update({
            where: { id: match.volunteerId },
            data: { deliveryCount: { increment: 1 } }
          })
        }
      }

      return m
    })

    await logActivity({
      organizationId: params.orgId,
      actorId: user.id,
      action: `match_${body.status}`,
      entityType: "match",
      entityId: match.id
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

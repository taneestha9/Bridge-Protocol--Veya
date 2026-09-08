import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  type: z.enum(["individual", "corporate", "institutional"]).default("individual"),
  totalContributed: z.number().nonnegative().default(0)
})

export async function GET(_: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    await requireOrgAccess(params.orgId)
    return NextResponse.json(await prisma.donor.findMany({
      where: { organizationId: params.orgId },
      orderBy: { createdAt: "desc" }
    }))
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    const { user } = await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const body = schema.parse(await req.json())
    const row = await prisma.donor.create({ data: { ...body, organizationId: params.orgId } })
    await prisma.activityLog.create({
      data: {
        organizationId: params.orgId,
        actorId: user.id,
        actorType: "user",
        action: "donor_created",
        entityType: "donor",
        entityId: row.id
      }
    })
    return NextResponse.json(row, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

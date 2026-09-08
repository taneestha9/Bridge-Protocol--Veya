import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireOrgAccess } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  type: z.enum(["individual", "corporate", "institutional"]).optional(),
  totalContributed: z.number().nonnegative().optional()
})

export async function PATCH(req: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    await requireOrgAccess(params.orgId, ["chapter_admin", "coordinator"])
    const existing = await prisma.donor.findFirst({ where: { id: params.id, organizationId: params.orgId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = schema.parse(await req.json())
    return NextResponse.json(await prisma.donor.update({ where: { id: params.id }, data: body }))
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { orgId: string; id: string } }) {
  try {
    await requireOrgAccess(params.orgId, ["chapter_admin"])
    const existing = await prisma.donor.findFirst({ where: { id: params.id, organizationId: params.orgId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.donor.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 })
  }
}

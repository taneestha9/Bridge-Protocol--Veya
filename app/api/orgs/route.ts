import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getOrCreateDbUser } from "@/lib/auth"
import { slugify } from "@/lib/slug"
import { logActivity } from "@/lib/audit"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2).max(120),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  type: z.string().min(2).max(60),
  description: z.string().max(1000).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  configuration: z.record(z.any()).optional()
})

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = schema.parse(await req.json())
    const base = slugify(body.name) || `chapter-${Date.now()}`
    let slug = base
    let n = 2

    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`
    }

    const org = await prisma.organization.create({
      data: {
        name: body.name,
        slug,
        city: body.city,
        country: body.country,
        type: body.type,
        description: body.description,
        latitude: body.latitude,
        longitude: body.longitude,
        configuration: body.configuration,
        status: "active",
        members: {
          create: {
            userId: user.id,
            role: "chapter_admin"
          }
        }
      },
      include: { members: true }
    })

    await logActivity({
      organizationId: org.id,
      actorId: user.id,
      action: "organization_created",
      entityType: "organization",
      entityId: org.id
    })

    return NextResponse.json(org, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Could not create organization" }, { status: 500 })
  }
}

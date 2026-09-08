import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const chapters = await prisma.organization.findMany({
    where: { status: "active" },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
      type: true,
      description: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      _count: { select: { cases: true, volunteers: true } }
    },
    orderBy: { createdAt: "asc" }
  })
  return NextResponse.json(chapters)
}

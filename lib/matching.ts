import { prisma } from "@/lib/prisma"

function distanceScore(
  aLat?: number | null,
  aLng?: number | null,
  bLat?: number | null,
  bLng?: number | null
) {
  if (
    aLat == null ||
    aLng == null ||
    bLat == null ||
    bLng == null
  ) return 0

  const latKm = (aLat - bLat) * 111
  const lngKm = (aLng - bLng) * 111 * Math.cos((aLat * Math.PI) / 180)
  const km = Math.sqrt(latKm * latKm + lngKm * lngKm)

  if (km <= 2) return 30
  if (km <= 5) return 24
  if (km <= 10) return 18
  if (km <= 20) return 10
  return 3
}

export async function findMatchesForCase(caseId: string, organizationId: string) {
  const targetCase = await prisma.case.findFirst({
    where: { id: caseId, organizationId },
    include: { beneficiary: true }
  })

  if (!targetCase) throw new Error("Case not found")

  const volunteers = await prisma.volunteer.findMany({
    where: { organizationId, status: "active" }
  })

  const scored = volunteers.map((volunteer) => {
    let score = 0

    score += distanceScore(
      targetCase.beneficiary.lat,
      targetCase.beneficiary.lng,
      volunteer.lat,
      volunteer.lng
    )

    score += Math.max(0, 20 - volunteer.deliveryCount)

    score += Math.min(20, Math.max(0, volunteer.reliabilityScore * 4))

    if (volunteer.skills.includes(targetCase.category)) score += 20
    if (volunteer.skills.includes("general")) score += 5
    if (targetCase.urgency === "red" && volunteer.skills.includes("emergency")) {
      score += 10
    }

    return {
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      score: Math.round(score),
      skillMatch: volunteer.skills.includes(targetCase.category)
    }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, 5)
}

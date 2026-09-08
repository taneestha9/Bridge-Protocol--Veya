import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const chapters = [
  { name: "Kolkata Chapter", slug: "kolkata-chapter", city: "Kolkata", country: "India", type: "student_group", latitude: 22.5726, longitude: 88.3639 },
  { name: "Dhaka Chapter", slug: "dhaka-chapter", city: "Dhaka", country: "Bangladesh", type: "student_group", latitude: 23.8103, longitude: 90.4125 },
  { name: "Nairobi Chapter", slug: "nairobi-chapter", city: "Nairobi", country: "Kenya", type: "ngo", latitude: -1.2864, longitude: 36.8172 }
]

async function main() {
  const seedUser = await prisma.user.upsert({
    where: { authUserId: "demo-auth-user" },
    update: {},
    create: { authUserId: "demo-auth-user", email: "demo@bridge.local", fullName: "Bridge Demo Admin" }
  })

  await prisma.organization.deleteMany({ where: { slug: { in: chapters.map((c) => c.slug) } } })

  for (const c of chapters) {
    const org = await prisma.organization.upsert({
      where: { slug: c.slug },
      update: { status: "active" },
      create: { ...c, status: "active", description: "Simulated Bridge Protocol demo chapter." }
    })

    await prisma.organizationMember.upsert({
      where: { userId_organizationId: { userId: seedUser.id, organizationId: org.id } },
      update: { role: "chapter_admin" },
      create: { userId: seedUser.id, organizationId: org.id, role: "chapter_admin" }
    })

    const volunteers = []
    for (let i = 1; i <= 3; i++) {
      volunteers.push(await prisma.volunteer.create({
        data: {
          organizationId: org.id,
          name: `${c.city} Volunteer ${i}`,
          phone: `+000000000${i}`,
          location: c.city,
          lat: c.latitude + (i * 0.02),
          lng: c.longitude + (i * 0.02),
          skills: i === 1 ? ["education", "general"] : i === 2 ? ["food", "delivery"] : ["healthcare", "emergency"],
          reliabilityScore: 3 + i * 0.5,
          deliveryCount: i
        }
      }))
    }

    const beneficiaries = []
    for (let i = 1; i <= 5; i++) {
      beneficiaries.push(await prisma.beneficiary.create({
        data: {
          organizationId: org.id,
          residentId: `${c.city.slice(0,3).toUpperCase()}-DEMO-${String(i).padStart(4,"0")}`,
          name: `Demo Beneficiary ${i}`,
          location: c.city,
          lat: c.latitude,
          lng: c.longitude,
          verificationStatus: i <= 3 ? "verified" : "reviewed"
        }
      }))
    }

    const statuses = ["submitted","under_review","verified","open","matched","in_progress","fulfilled","closed","rejected","cancelled"] as const
    for (let i = 0; i < 10; i++) {
      const status = statuses[i]
      const v = volunteers[i % volunteers.length]
      const b = beneficiaries[i % beneficiaries.length]
      const kase = await prisma.case.create({
        data: {
          organizationId: org.id,
          beneficiaryId: b.id,
          title: `${["Education","Food","Healthcare","Transport","Documents"][i % 5]} support request`,
          description: "Simulated demo case. Do not treat this record as a real beneficiary request.",
          category: ["education","food","healthcare","transport","documents"][i % 5],
          urgency: i % 3 === 0 ? "red" : i % 2 === 0 ? "yellow" : "green",
          status,
          verificationLevel: status === "fulfilled" || status === "closed" ? 3 : status === "verified" || status === "open" || status === "matched" || status === "in_progress" ? 2 : status === "under_review" ? 1 : 0,
          matchedVolunteerId: ["matched","in_progress","fulfilled","closed"].includes(status) ? v.id : null,
          completedAt: ["fulfilled","closed"].includes(status) ? new Date() : null
        }
      })
      await prisma.caseAuditLog.create({
        data: { caseId: kase.id, actorId: seedUser.id, action: "seeded_demo_case", newState: status }
      })
    }
  }
}

main().finally(() => prisma.$disconnect())

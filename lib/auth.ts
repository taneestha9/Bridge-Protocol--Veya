import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import type { MemberRole } from "@prisma/client"

export async function getSupabaseUser() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

export async function getCurrentUserWithMemberships() {
  const authUser = await getSupabaseUser()
  if (!authUser?.email) return null

  return prisma.user.findUnique({
    where: { authUserId: authUser.id },
    include: { memberships: { include: { organization: true } } },
  })
}

export async function getOrCreateDbUser() {
  const authUser = await getSupabaseUser()
  if (!authUser?.email) return null

  const fullName =
    (authUser.user_metadata?.full_name as string | undefined) ||
    authUser.email.split("@")[0]

  return prisma.user.upsert({
    where: { authUserId: authUser.id },
    update: { email: authUser.email, fullName },
    create: { authUserId: authUser.id, email: authUser.email, fullName },
    include: { memberships: { include: { organization: true } } },
  })
}

export async function requireOrgAccess(
  organizationId: string,
  allowedRoles: MemberRole[] = []
) {
  const user = await getOrCreateDbUser()
  if (!user) throw new Error("Unauthorized")

  const membership = user.memberships.find(
    (m) => m.organizationId === organizationId
  )

  if (!membership) throw new Error("Forbidden")

  if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
    throw new Error("Forbidden: insufficient role")
  }

  return { user, membership }
}

import { prisma } from "@/lib/prisma"

export async function logActivity(args: {
  organizationId?: string
  actorId: string
  action: string
  entityType?: string
  entityId?: string
  metadata?: unknown
}) {
  return prisma.activityLog.create({
    data: {
      organizationId: args.organizationId,
      actorType: "user",
      actorId: args.actorId,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      metadata: args.metadata as object | undefined
    }
  })
}

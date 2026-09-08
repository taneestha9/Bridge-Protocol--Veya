import { NextRequest, NextResponse } from "next/server"
import { requireOrgAccess } from "@/lib/auth"
import { Resend } from "resend"
import { z } from "zod"

const schema = z.object({ email: z.string().email(), role: z.enum(["coordinator", "volunteer", "viewer"]).default("volunteer") })

export async function POST(req: NextRequest, { params }: { params: { orgId: string } }) {
  try {
    await requireOrgAccess(params.orgId, ["chapter_admin"])
    const body = schema.parse(await req.json())
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 503 })
    const resend = new Resend(process.env.RESEND_API_KEY)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Bridge Protocol <onboarding@example.com>",
      to: body.email,
      subject: "You've been invited to Bridge Protocol",
      html: `<p>You have been invited to join a Bridge Protocol chapter as a ${body.role}.</p><p><a href="${appUrl}/signup">Create your account</a>, then ask the chapter administrator to assign your membership.</p>`
    })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 })
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invite failed" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getOrCreateDbUser } from "@/lib/auth"

export async function POST() {
  try {
    const user = await getOrCreateDbUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Could not bootstrap profile" }, { status: 500 })
  }
}

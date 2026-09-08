import { redirect } from "next/navigation"
import { getOrCreateDbUser } from "@/lib/auth"
import { OnboardingForm } from "@/components/onboarding-form"

export default async function Onboarding() {
  const user = await getOrCreateDbUser()
  if (!user) redirect("/login")
  return <main className="container-page py-16"><OnboardingForm /></main>
}

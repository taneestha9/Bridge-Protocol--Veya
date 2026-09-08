import Link from "next/link"
import { redirect } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { getOrCreateDbUser } from "@/lib/auth"

export default async function WorkspacePage() {
  const user = await getOrCreateDbUser()
  if (!user) redirect("/login")

  const membership = user.memberships[0]

  if (membership?.organization?.slug) {
    redirect(`/${membership.organization.slug}/cases`)
  }

  return (
    <>
      <SiteNav />
      <main className="container-page max-w-4xl py-16">
        <p className="eyebrow">My workspace</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Welcome, {user.fullName}.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          You have an account but no organization membership yet. Choose how you want to participate.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link href="/participate" className="card p-6 hover:shadow-md">
            <h2 className="font-semibold text-navy">Choose a participation path</h2>
            <p className="mt-2 text-sm text-slate-600">Volunteer, join, provide resources, represent an organization, or request support.</p>
          </Link>
          <Link href="/explore" className="card p-6 hover:shadow-md">
            <h2 className="font-semibold text-navy">Explore the network</h2>
            <p className="mt-2 text-sm text-slate-600">Learn about Bridge and discover participating chapters.</p>
          </Link>
        </div>
      </main>
    </>
  )
}

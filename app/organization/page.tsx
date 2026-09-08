import Link from "next/link"
import { SiteNav } from "@/components/site-nav"

export default function OrganizationPage() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-3xl py-16">
        <p className="eyebrow">Organizations</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Bring your organization onto Bridge.</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Organization onboarding is separate from ordinary account creation. Verification and operational permissions are handled before sensitive network access is granted.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link href="/signup" className="card p-6 hover:shadow-md">
            <h2 className="font-semibold text-navy">Create an account</h2>
            <p className="mt-2 text-sm text-slate-600">Start with your personal Bridge identity.</p>
          </Link>
          <Link href="/docs" className="card p-6 hover:shadow-md">
            <h2 className="font-semibold text-navy">Read the protocol</h2>
            <p className="mt-2 text-sm text-slate-600">Understand verification, safeguards and network responsibilities.</p>
          </Link>
        </div>
      </main>
    </>
  )
}

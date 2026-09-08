import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { AuthForm } from "@/components/auth-form"

export default function Signup() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-2xl py-16">
        <p className="eyebrow">Bridge Protocol</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Create your Bridge account.</h1>
        <p className="mt-4 text-slate-600">
          An account lets you participate. It does not automatically create a chapter or organization.
        </p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-5 text-sm text-slate-600">
          Already registered? <Link href="/login" className="font-semibold text-navy">Sign in</Link>
        </p>
      </main>
    </>
  )
}

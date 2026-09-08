import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { AuthForm } from "@/components/auth-form"

export default function Login() {
  return (
    <>
      <SiteNav />
      <main className="container-page max-w-2xl py-16">
        <p className="eyebrow">Bridge Protocol</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">Welcome back.</h1>
        <p className="mt-4 text-slate-600">
          Sign in and Bridge will take you back to your existing workspace or participation path.
        </p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
        <p className="mt-5 text-sm text-slate-600">
          New here? <Link href="/signup" className="font-semibold text-navy">Create an account</Link>
        </p>
      </main>
    </>
  )
}

import Link from "next/link"
import { AuthForm } from "@/components/auth-form"

export default function Signup() {
  return <main className="container-page max-w-lg py-20"><p className="eyebrow">Bridge Protocol</p><h1 className="mt-2 text-4xl font-bold">Create an account</h1><p className="mt-3 text-slate-600">Start a chapter in a few minutes.</p><div className="mt-8"><AuthForm mode="signup" /></div><p className="mt-5 text-sm text-slate-600">Already registered? <Link href="/login" className="font-semibold text-navy">Sign in</Link></p></main>
}

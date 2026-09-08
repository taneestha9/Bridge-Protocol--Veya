import Link from "next/link"
import { AuthForm } from "@/components/auth-form"

export default function Login() {
  return <main className="container-page max-w-lg py-20"><p className="eyebrow">Bridge Protocol</p><h1 className="mt-2 text-4xl font-bold">Sign in</h1><p className="mt-3 text-slate-600">Access your chapter workspace.</p><div className="mt-8"><AuthForm mode="login" /></div><p className="mt-5 text-sm text-slate-600">New here? <Link href="/signup" className="font-semibold text-navy">Create an account</Link></p></main>
}

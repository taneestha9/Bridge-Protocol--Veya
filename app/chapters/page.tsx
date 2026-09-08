import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { SiteNav } from "@/components/site-nav"

export default async function Chapters() {
  const chapters = await prisma.organization.findMany({
    where: { status: "active" },
    include: { _count: { select: { cases: true, volunteers: true } } },
    orderBy: [{ country: "asc" }, { city: "asc" }]
  })
  return <>
    <SiteNav />
    <main className="container-page py-14">
      <p className="eyebrow">Network</p><h1 className="mt-2 text-4xl font-bold">Chapter directory</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {chapters.map(c => <Link href={`/${c.slug}/cases`} key={c.id} className="card p-6 hover:-translate-y-0.5 transition"><p className="text-xl font-semibold">{c.name}</p><p className="mt-1 text-slate-500">{c.city}, {c.country}</p><p className="mt-5 text-sm text-slate-600">{c._count.cases} cases · {c._count.volunteers} volunteers</p></Link>)}
      </div>
    </main>
  </>
}

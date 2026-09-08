import dynamic from "next/dynamic"
import { prisma } from "@/lib/prisma"
import { SiteNav } from "@/components/site-nav"

const ChapterMap = dynamic(() => import("@/components/chapter-map").then(m => m.ChapterMap), { ssr: false })

export default async function Dashboard() {
  const [organizations, cases, volunteers, fulfilled] = await Promise.all([
    prisma.organization.findMany({ where: { status: "active" }, distinct: ["city"], select: { city: true } }).then(x => x.length),
    prisma.case.count(),
    prisma.volunteer.count({ where: { status: "active" } }),
    prisma.case.count({ where: { status: "fulfilled" } })
  ])
  const chapters = await prisma.organization.findMany({
    where: { status: "active" },
    select: { id: true, name: true, city: true, country: true, latitude: true, longitude: true }
  })
  return <>
    <SiteNav />
    <main className="container-page py-14">
      <p className="eyebrow">Public layer</p>
      <h1 className="mt-2 text-4xl font-bold">Bridge Network Dashboard</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Aggregate activity across participating chapters. No beneficiary-level information is exposed here.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[["Active chapters", organizations], ["Cases processed", cases], ["Active volunteers", volunteers], ["Cases fulfilled", fulfilled]].map(([label, value]) =>
          <div className="card p-6" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-navy">{value}</p></div>
        )}
      </div>
      <div className="mt-10"><ChapterMap chapters={chapters} /></div>
    </main>
  </>
}

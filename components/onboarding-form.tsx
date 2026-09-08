"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type Org = { id: string; slug: string; name: string }

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [org, setOrg] = useState<Org | null>(null)
  const [beneficiaryId, setBeneficiaryId] = useState("")
  const [form, setForm] = useState({
    name: "", city: "", country: "", type: "student_group", description: "",
    categories: "education,food,healthcare,transport,documents",
    operatingArea: ""
  })
  const [volunteer, setVolunteer] = useState({ name: "", phone: "", location: "", skills: "general" })
  const [beneficiary, setBeneficiary] = useState({ residentId: "", name: "", location: "", phone: "" })
  const [caseForm, setCaseForm] = useState({ title: "", description: "", category: "education", urgency: "green" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form, value: string) =>
    setForm((old) => ({ ...old, [key]: value }))

  async function post(path: string, body: unknown) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || data.error || "Request failed")
    return data
  }

  async function createOrg() {
    setLoading(true); setError("")
    try {
      const data = await post("/api/orgs", {
        ...form,
        configuration: {
          categories: form.categories.split(",").map(x => x.trim()).filter(Boolean),
          operatingArea: form.operatingArea
        }
      })
      setOrg(data)
      setStep(4)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create chapter")
    } finally { setLoading(false) }
  }

  async function createVolunteer() {
    if (!org) return
    setLoading(true); setError("")
    try {
      await post(`/api/orgs/${org.id}/volunteers`, {
        ...volunteer,
        skills: volunteer.skills.split(",").map(x => x.trim()).filter(Boolean)
      })
      setStep(6)
    } catch (e) { setError(e instanceof Error ? e.message : "Could not add volunteer") }
    finally { setLoading(false) }
  }

  async function createBeneficiary() {
    if (!org) return
    setLoading(true); setError("")
    try {
      const data = await post(`/api/orgs/${org.id}/beneficiaries`, beneficiary)
      setBeneficiaryId(data.id)
      setStep(7)
    } catch (e) { setError(e instanceof Error ? e.message : "Could not add beneficiary") }
    finally { setLoading(false) }
  }

  async function createCase() {
    if (!org || !beneficiaryId) return
    setLoading(true); setError("")
    try {
      await post(`/api/orgs/${org.id}/cases`, { ...caseForm, beneficiaryId })
      setStep(8)
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create case") }
    finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 grid grid-cols-8 gap-1">{Array.from({ length: 8 }, (_, i) => i + 1).map(n =>
        <div key={n} className={`h-1 rounded ${n <= step ? "bg-navy" : "bg-slate-200"}`} />
      )}</div>
      <div className="card p-8">
        {step === 1 && <><p className="eyebrow">Step 1 · Account</p><h1 className="mt-2 text-3xl font-bold">Welcome to Bridge</h1><p className="mt-4 text-slate-600">Your authenticated account is ready. Next, create the chapter workspace you will operate.</p></>}
        {step === 2 && <><p className="eyebrow">Step 2 · Chapter</p><h1 className="mt-2 text-3xl font-bold">Name your chapter</h1><div className="mt-6 space-y-3"><input placeholder="Organization / chapter name" value={form.name} onChange={e=>update("name",e.target.value)} className="w-full rounded-xl border p-3"/><input placeholder="City" value={form.city} onChange={e=>update("city",e.target.value)} className="w-full rounded-xl border p-3"/><input placeholder="Country" value={form.country} onChange={e=>update("country",e.target.value)} className="w-full rounded-xl border p-3"/></div></>}
        {step === 3 && <><p className="eyebrow">Step 3 · Configure</p><h1 className="mt-2 text-3xl font-bold">Configure your operation</h1><div className="mt-6 space-y-3"><select value={form.type} onChange={e=>update("type",e.target.value)} className="w-full rounded-xl border p-3"><option value="student_group">Student group</option><option value="ngo">NGO</option><option value="community">Community organization</option><option value="other">Other</option></select><input placeholder="Categories, comma separated" value={form.categories} onChange={e=>update("categories",e.target.value)} className="w-full rounded-xl border p-3"/><input placeholder="Operating area" value={form.operatingArea} onChange={e=>update("operatingArea",e.target.value)} className="w-full rounded-xl border p-3"/><textarea placeholder="Short description" value={form.description} onChange={e=>update("description",e.target.value)} className="min-h-28 w-full rounded-xl border p-3"/></div></>}
        {step === 4 && <><p className="eyebrow">Step 4 · Team</p><h1 className="mt-2 text-3xl font-bold">Invite your team</h1><p className="mt-4 text-slate-600">For the MVP, send team invitations from the chapter workspace using the Resend integration. Continue to add your first operational volunteer now.</p></>}
        {step === 5 && <><p className="eyebrow">Step 5 · Volunteer</p><h1 className="mt-2 text-3xl font-bold">Add your first volunteer</h1><div className="mt-6 space-y-3"><input placeholder="Name" value={volunteer.name} onChange={e=>setVolunteer({...volunteer,name:e.target.value})} className="w-full rounded-xl border p-3"/><input placeholder="Phone" value={volunteer.phone} onChange={e=>setVolunteer({...volunteer,phone:e.target.value})} className="w-full rounded-xl border p-3"/><input placeholder="Location" value={volunteer.location} onChange={e=>setVolunteer({...volunteer,location:e.target.value})} className="w-full rounded-xl border p-3"/><input placeholder="Skills, comma separated" value={volunteer.skills} onChange={e=>setVolunteer({...volunteer,skills:e.target.value})} className="w-full rounded-xl border p-3"/></div></>}
        {step === 6 && <><p className="eyebrow">Step 6 · Beneficiary</p><h1 className="mt-2 text-3xl font-bold">Add the first beneficiary</h1><p className="mt-3 text-sm text-amber-700">Only enter information necessary for legitimate chapter operations.</p><div className="mt-6 space-y-3"><input placeholder="Internal resident ID" value={beneficiary.residentId} onChange={e=>setBeneficiary({...beneficiary,residentId:e.target.value})} className="w-full rounded-xl border p-3"/><input placeholder="Name" value={beneficiary.name} onChange={e=>setBeneficiary({...beneficiary,name:e.target.value})} className="w-full rounded-xl border p-3"/><input placeholder="Location (avoid unnecessary precision)" value={beneficiary.location} onChange={e=>setBeneficiary({...beneficiary,location:e.target.value})} className="w-full rounded-xl border p-3"/><input placeholder="Phone (optional)" value={beneficiary.phone} onChange={e=>setBeneficiary({...beneficiary,phone:e.target.value})} className="w-full rounded-xl border p-3"/></div></>}
        {step === 7 && <><p className="eyebrow">Step 7 · First case</p><h1 className="mt-2 text-3xl font-bold">Create your first case</h1><div className="mt-6 space-y-3"><input placeholder="Case title" value={caseForm.title} onChange={e=>setCaseForm({...caseForm,title:e.target.value})} className="w-full rounded-xl border p-3"/><textarea placeholder="Description" value={caseForm.description} onChange={e=>setCaseForm({...caseForm,description:e.target.value})} className="min-h-28 w-full rounded-xl border p-3"/><select value={caseForm.category} onChange={e=>setCaseForm({...caseForm,category:e.target.value})} className="w-full rounded-xl border p-3"><option>education</option><option>food</option><option>healthcare</option><option>transport</option><option>documents</option></select><select value={caseForm.urgency} onChange={e=>setCaseForm({...caseForm,urgency:e.target.value})} className="w-full rounded-xl border p-3"><option value="green">Green · Normal</option><option value="yellow">Yellow · Medium</option><option value="red">Red · Urgent</option></select></div></>}
        {step === 8 && <><p className="eyebrow">Step 8 · Complete</p><h1 className="mt-2 text-3xl font-bold">Your chapter is live.</h1><p className="mt-4 text-slate-600">You created the chapter, added an initial volunteer and beneficiary, and created the first case. Continue in the workspace to verify, match and fulfill it.</p></>}
        {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-8 flex justify-between">
          <Button type="button" className="bg-white text-navy ring-1 ring-slate-200" onClick={()=>setStep(Math.max(1,step-1))} disabled={step===1 || step===8}>Back</Button>
          {step === 1 && <Button onClick={()=>setStep(2)}>Begin</Button>}
          {step === 2 && <Button onClick={()=>setStep(3)} disabled={!form.name||!form.city||!form.country}>Continue</Button>}
          {step === 3 && <Button onClick={createOrg} disabled={loading}>Create chapter</Button>}
          {step === 4 && <Button onClick={()=>setStep(5)}>Continue</Button>}
          {step === 5 && <Button onClick={createVolunteer} disabled={loading||!volunteer.name||!volunteer.location}>{loading?"Saving...":"Add volunteer"}</Button>}
          {step === 6 && <Button onClick={createBeneficiary} disabled={loading||!beneficiary.residentId||!beneficiary.name||!beneficiary.location}>{loading?"Saving...":"Add beneficiary"}</Button>}
          {step === 7 && <Button onClick={createCase} disabled={loading||!caseForm.title||!caseForm.description}>{loading?"Saving...":"Create case"}</Button>}
          {step === 8 && <Button onClick={()=>router.push(`/${org?.slug}/cases`)}>Open dashboard</Button>}
        </div>
      </div>
    </div>
  )
}

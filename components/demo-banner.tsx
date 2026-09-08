export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return null
  return <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">Demo Mode — Data is simulated. Do not treat demo records as real beneficiary requests.</div>
}

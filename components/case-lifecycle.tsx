"use client"

const stages = [
  ["submitted", "Submitted"],
  ["under_review", "Under Review"],
  ["verified", "Verified"],
  ["open", "Open"],
  ["matched", "Matched"],
  ["in_progress", "In Progress"],
  ["fulfilled", "Fulfilled"],
  ["closed", "Closed"]
]

export function CaseLifecycle({ currentStatus }: { currentStatus: string }) {
  const currentIndex = stages.findIndex(([key]) => key === currentStatus)
  return (
    <div className="flex gap-2 overflow-x-auto py-4">
      {stages.map(([key, label], index) => (
        <div key={key} className="flex shrink-0 items-center gap-2">
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${
            index <= currentIndex ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-400"
          }`}>
            {label}
          </div>
          {index < stages.length - 1 && <div className={`h-0.5 w-4 ${index < currentIndex ? "bg-teal-500" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  )
}

import Link from "next/link"

type Props = {
  href: string
  title: string
  body: string
  eyebrow?: string
}

export function ParticipationCard({ href, title, body, eyebrow }: Props) {
  return (
    <Link
      href={href}
      className="group card block p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-xl font-semibold text-navy group-hover:underline">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">{body}</p>
      <span className="mt-5 inline-block text-sm font-semibold text-navy">
        Continue →
      </span>
    </Link>
  )
}

export default function Faq({ items }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-cream">
      {items.map((item) => (
        <details key={item.q} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium text-charcoal [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="text-2xl font-light leading-none text-burgundy transition group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  )
}

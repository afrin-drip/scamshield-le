import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — ScamShield LE',
  description: 'How ScamShield LE collects, uses, and protects your data.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-800">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-4">{children}</div>
    </section>
  )
}

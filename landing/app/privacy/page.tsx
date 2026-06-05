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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span>🛡️</span><span className="font-black">ScamShield <span className="text-red-600">LE</span></span></Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">&larr; Back to home</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12"><h1 className="text-4xl font-black mb-3">Privacy Policy</h1><p className="text-gray-500 text-sm">Last updated: January 1, 2025</p></div>
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 mb-10"><p className="text-sm text-gray-300 leading-relaxed"><strong className="text-white">Summary:</strong> ScamShield LE processes call audio locally on your device. We do not store raw audio. Anonymized scam signal data may be shared with law enforcement. We never sell your personal data.</p></div>
        <Section title="1. Who We Are"><p>ScamShield LE operates the ScamShield LE mobile app and scamshieldle.com.</p><p>Contact: <a href="mailto:privacy@scamshieldle.com" className="text-red-500 hover:underline">privacy@scamshieldle.com</a></p></Section>
        <Section title="2. Information We Collect"><p><strong className="text-white">2.1 Call Audio (Processed Locally)</strong><br />Audio is processed on-device. Raw audio is never transmitted or  stored.</p><p><strong className="text-white">2.2 Anonymized Scam Signal Data</strong><br />Detected signal types, risk score, timestamp, and city/state region only.</p><p ><strong className="text-white">2.3 Account Information</strong><br />Email address and hashed password. Billing handled by Stripe.</p><p ><strong className="text-white">2.4 Usage Analytics</strong><br />Anonymized app usage data for product improvement.</p></Section>
        <Section title="3. How We Use Your Information"><p>We use collected information to power real-time scam detection, fire alerts, improve detection accuracy, provide anonymized intelligence to law enforcement partners, process payments, and improve the app.</p></Section>
        <Section title="4. Law Enforcement Data Sharing"><p>ScamShield LE shares anonymized scam trend data with verified law enforcement agencies. This data does NOT include your name, phone number, or call contents.</p></Section>
        <Section title="5. Data Retention"><p>Anonymized signal data: up to 24 months. Account data: retained while active and 30 days after deletion.</p></Section>
        <Section title="6. Your Rights"><ul className="list-disc list-inside space-y-1 pl-2"><li>Access your data</li><li>Request correction or deletion</li><li>Opt out of analytics</li><li>Data portability</li></ul><p>Email <a href="mailto:privacy@scamshieldle.com" className="text-red-500 hover:underline">privacy@scamshieldle.com</a> to exercise rights.</p></Section>
        <Section title="7. Security"><p>TLS encryption in transit, AES-256 at rest, regular security audits.</p></Section>
        <Section title="8. Children's Privacy"><p>ScamShield LE is not directed to children under 13.</p></Section>
        <Section title="9. Third-Party Services"><ul className="list-disc list-inside space-y-1 pl-2"><li><strong className="text-white">Stripe</strong> &mdash; Payment processing</li><li><strong className="text-white">Google Play / Apple App Store</strong> &mdash; App distribution</li><li><strong className="text-white">Vercel</strong> &mdash; Website hosting</li></ul></Section>
        <Section title="10. Changes to This Policy"><p>We will notify you of material changes via email or in-app notice at least 14 days before the change takes effect.</p></Section>
        <Section title="11. Contact Us"><p>Email: <a href="mailto:privacy@scamshieldle.com" className="text-red-500 hover:underline">privacy@scamshieldle.com</a> | Web: <Link href="/contact" className="text-red-500 hover:underline">scamshieldle.com/contact</Link></p></Section>
      </main>
      <footer className="border-t border-gray-900 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">&copy; 2025 ScamShield LE.</p>
          <div className="flex gap-6 text-sm text-gray-600"><Link href="/" className="hover:text-white transition-colors">Home</Link><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></div>
        </div>
      </footer>
    </div>
  )
}

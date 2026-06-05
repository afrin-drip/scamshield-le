'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ── Risk Meter ─────────────────────────────────────────────────────────── */
function RiskMeter() {
  const [score, setScore] = useState(0)
  const [alertFired, setAlertFired] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => {
      setScore(p => {
        if (p >= 95) { clearInterval(id); setAlertFired(true); return 95 }
        return p + 1
      })
    }, 22)
    return () => clearInterval(id)
  }, [visible])

  const color = score >= 80 ? '#D32F2F' : score >= 60 ? '#EF5350' : score >= 30 ? '#F59E0B' : '#22C55E'
  const label = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW'

  const signals = [
    { icon: '👮', text: 'Law enforcement claim',    pts: 25, show: score >= 15 },
    { icon: '📋', text: 'Warrant / arrest language', pts: 20, show: score >= 35 },
    { icon: '💰', text: 'Request for money',         pts: 40, show: score >= 55 },
    { icon: '⏰', text: "Urgency / \"don't hang up\"", pts: 20, show: score >= 75 },
  ]

  return (
    <div ref={ref} className="relative">
      <div
        className="absolute inset-0 rounded-3xl blur-3xl opacity-20 transition-all duration-1000"
        style={{ background: color }}
      />
      <div className="relative bg-card border border-gray-800 rounded-3xl p-7 shadow-2xl">
        {/* Call header */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-800">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg">👮</div>
            {score > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">"IRS Agent Johnson"</div>
            <div className="text-xs text-gray-500 font-mono">+1 (800) 555-0147</div>
          </div>
          <div className="text-xs text-gray-600 font-mono">
            {String(Math.floor(score / 60)).padStart(2,'0')}:{String(score % 60).padStart(2,'0')}
          </div>
        </div>

        {/* Score + gauge */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Scam Risk Score</div>
            <div className="text-7xl font-black tabular-nums leading-none" style={{ color }}>
              {score}
            </div>
            <div className="text-xs font-black tracking-widest mt-1" style={{ color }}>{label} RISK</div>
          </div>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🛡️</div>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${score}%`, background: `linear-gradient(to right, #22C55E, ${color})` }}
          />
        </div>

        {/* Signals */}
        <div className="space-y-2 mb-5">
          {signals.map(s => (
            <div
              key={s.text}
              className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 transition-all duration-500 ${
                s.show
                  ? 'bg-red-900/20 border border-red-800/50 opacity-100'
                  : 'bg-gray-900/50 border border-transparent opacity-30'
              }`}
            >
              <span className="flex items-center gap-2 text-gray-300">
                <span>{s.icon}</span> {s.text}
              </span>
              {s.show && <span className="text-red-400 font-bold text-xs">+{s.pts}</span>}
            </div>
          ))}
        </div>

        {/* Alert */}
        {alertFired && (
          <div className="bg-red-950/50 border border-red-700 rounded-2xl p-4 text-center animate-pulse">
            <div className="text-3xl mb-1">🚨</div>
            <div className="text-red-400 font-black text-sm tracking-wider">SCAM ALERT FIRED</div>
            <div className="text-xs text-gray-300 mt-1">Connecting to verified agency contacts…</div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sticky Nav ─────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-gray-900 shadow-2xl' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-black text-lg tracking-tight">
              ScamShield <span className="text-red-600">LE</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-gray-400">
            <a href="#how-it-works"    className="hover:text-white transition-colors">How It Works</a>
            <a href="#signals"         className="hover:text-white transition-colors">Detection</a>
            <a href="#pricing"         className="hover:text-white transition-colors">Pricing</a>
            <a href="#law-enforcement" className="hover:text-white transition-colors">For Agencies</a>
            <a
              href="https://portal.scamshieldle.com"
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              LE Portal
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      <Nav />

      {/* HERO */}
      <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-800/40 text-red-400 text-xs font-bold px-4 py-2 rounded-full mb-7 tracking-wider uppercase">
              <span>🚨</span> Real-time AI Scam Detection
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black leading-[1.1] mb-6 tracking-tight">
              Stop Law Enforcement<br />
              <span style={{ background: 'linear-gradient(135deg,#EF5350,#D32F2F)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Impersonation Scams
              </span>
              <br />— Before Money Is Lost
            </h1>
            <p className="text-lg text-gray-400 mb-9 leading-relaxed max-w-xl">
              ScamShield LE detects scam calls in real time using AI, fires an instant alert,
              and connects you to verified agencies — before the scammer gets a cent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href="https://play.google.com/store"
                className="inline-flex items-center justify-center gap-3 bg-red-700 hover:bg-red-800 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl text-sm"
                style={{ boxShadow: '0 0 0 0 rgba(211,47,47,0)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 20px 40px rgba(211,47,47,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(211,47,47,0)')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.4.22.85.24 1.27.07L15.93 12 4.45.17C4.03 0 3.58.02 3.18.24 2.4.68 2 1.57 2 2.89v18.22c0 1.32.4 2.21 1.18 2.65z"/>
                  <path d="M19.93 10.06 17.2 8.53l-3.11 3.47 3.11 3.47 2.73-1.53c.78-.44 1.22-1.1 1.22-1.94 0-.84-.44-1.5-1.22-1.94z"/>
                  <path d="M4.45.17 15.58 11.53 12.47 15 4.45.17z" opacity=".5"/>
                  <path d="M4.45 23.83 12.47 16.15l-3.11-3.12z" opacity=".5"/>
                </svg>
                Get the App — Google Play
              </a>
              <a
                href="https://portal.scamshieldle.com"
                className="inline-flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:bg-white/5 text-sm"
              >
                🏛️ Law Enforcement Portal
              </a>
            </div>
            <p className="text-xs text-gray-600">Free to download · No credit card required · Android · iOS coming soon</p>
          </div>
          <RiskMeter />
        </div>
      </section>

      {/* CORE RULE BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-red-950/40 to-red-950/10 border border-red-900/50 rounded-2xl px-7 py-5">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-700 rounded-l-2xl" />
            <p className="text-base sm:text-lg font-semibold leading-relaxed pl-2">
              ⚠️{' '}
              <span className="text-red-400">
                Real law enforcement will NEVER demand immediate payment over the phone to avoid arrest.
              </span>{' '}
              If that happens — it&apos;s a scam. Hang up.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">The Process</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Three Steps to Protected</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              ScamShield LE works silently in the background, scoring every incoming call in real time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎤', step: '01', title: 'Listens to Your Call',
                desc: 'Runs silently in the background, analyzing call audio in real time with no manual input required.' },
              { icon: '🧠', step: '02', title: 'AI Detects Scam Patterns',
                desc: 'Our trained model scores the call against 5+ key signals, updating the risk score every second.' },
              { icon: '🚨', step: '03', title: 'Fires Full-Screen Alert',
                desc: 'Before money is lost, a full-screen alert fires with verified agency contacts and next steps.' },
            ].map(item => (
              <div
                key={item.step}
                className="relative bg-[#1A1A1A] border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute top-7 right-7 text-7xl font-black text-gray-900 select-none">{item.step}</div>
                <div className="text-5xl mb-5">{item.icon}</div>
                <div className="text-xs font-bold text-red-600/70 tracking-widest mb-2 uppercase">Step {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETECTION SIGNALS */}
      <section id="signals" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">AI Scoring Engine</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What We Detect</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Five key scam signals scored in real time. Score reaches 100 → alert fires automatically.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '👮', signal: 'Law enforcement claim',      score: 25,
                desc: 'Claims to be IRS, DEA, FBI, SSA, or local police' },
              { icon: '📋', signal: 'Warrant / arrest language',  score: 20,
                desc: 'Mentions arrest warrants, outstanding charges, or court orders' },
              { icon: '💰', signal: 'Request for money',          score: 40,
                desc: 'Demands payment to clear a debt, fine, or pending warrant' },
              { icon: '💳', signal: 'Gift cards / crypto / wire', score: 60,
                desc: 'Unusual payment methods — the single strongest red flag' },
              { icon: '⏰', signal: "Urgency / \"don't hang up\"", score: 20,
                desc: 'Pressure tactics designed to keep you on the line and afraid' },
            ].map(item => (
              <div
                key={item.signal}
                className="bg-[#0A0A0A] border border-gray-800 hover:border-red-900/60 rounded-2xl p-6 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-xs font-black px-3 py-1 rounded-full">
                    +{item.score} pts
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2">{item.signal}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
            <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-3">🎯</div>
              <div className="text-2xl font-black text-white mb-1">Score &ge; 100</div>
              <div className="text-red-400 font-bold text-sm mb-3">Automatic Full-Screen Alert</div>
              <div className="text-gray-500 text-xs leading-relaxed">
                No buttons to press. The alert fires before you even realize it&apos;s a scam.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">The Scale of the Problem</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { val: '$1.3B', sub: 'Lost to government impersonation scams in 2023', src: 'FTC Data' },
              { val: '#2',    sub: 'Most reported fraud type to the FTC',            src: 'FTC Consumer Sentinel' },
              { val: '3 sec', sub: 'Average time to fire a scam alert from call start', src: 'Internal benchmark' },
              { val: '10',    sub: 'Verified agency contacts built in at launch',    src: 'ScamShield LE' },
            ].map(s => (
              <div key={s.val} className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-7 text-center hover:border-gray-700 transition-colors">
                <div className="text-5xl font-black text-red-600 mb-3">{s.val}</div>
                <div className="text-gray-300 text-sm mb-3 leading-relaxed">{s.sub}</div>
                <div className="text-xs text-gray-600 font-medium uppercase tracking-wider">{s.src}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">Platform</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Available Everywhere You Need It</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🤖', title: 'Android App',
                desc: 'Full real-time detection with instant alerts. Available now on Google Play.',
                badge: 'Available Now', bc: 'bg-green-900/20 border-green-800/40 text-green-400',
                href: 'https://play.google.com/store' },
              { icon: '🍎', title: 'iOS App',
                desc: 'Coming soon — the same protection for iPhone users.',
                badge: 'Coming Soon', bc: 'bg-yellow-900/20 border-yellow-800/40 text-yellow-400',
                href: null },
              { icon: '👨‍👩‍👧', title: 'Family Protection',
                desc: 'Protect up to 6 family members under one subscription with a shared dashboard.',
                badge: 'Pro Feature', bc: 'bg-blue-900/20 border-blue-800/40 text-blue-400',
                href: null },
              { icon: '🏛️', title: 'LE Data Portal',
                desc: 'Anonymized scam data, GPS heat maps, and real-time alerts for law enforcement.',
                badge: 'portal.scamshieldle.com', bc: 'bg-red-900/20 border-red-800/40 text-red-400',
                href: 'https://portal.scamshieldle.com' },
            ].map(p => (
              <div key={p.title} className="bg-[#0A0A0A] border border-gray-800 hover:border-gray-700 rounded-2xl p-6 flex flex-col transition-colors">
                <div className="text-4xl mb-4">{p.icon}</div>
                <span className={`inline-flex self-start text-xs font-bold px-3 py-1 rounded-full border mb-4 ${p.bc}`}>
                  {p.badge}
                </span>
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.desc}</p>
                {p.href && (
                  <a href={p.href} className="mt-4 text-xs text-red-500 font-semibold hover:underline">
                    Learn more &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Simple, Honest Pricing</h2>
            <p className="text-gray-400">Protection for individuals, families, and agencies</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {[
              { name: 'Free',       price: '$0',    period: 'forever',
                features: ['Real-time scam scoring', 'Basic alert system', '3 verified agency contacts', '1 device'],
                cta: 'Download Free', href: 'https://play.google.com/store', featured: false },
              { name: 'Pro',        price: '$2.99', period: '/month',
                features: ['Everything in Free', 'Full alert + call blocking', 'All 10 agency contacts', 'Scam call history & reports', '1 device'],
                cta: 'Start Pro', href: 'https://play.google.com/store', featured: true },
              { name: 'Family',     price: '$4.99', period: '/month',
                features: ['Everything in Pro', 'Up to 6 family members', 'Shared family dashboard', 'Priority support'],
                cta: 'Protect Family', href: 'https://play.google.com/store', featured: false },
              { name: 'Enterprise', price: 'Custom', period: '',
                features: ['For law enforcement agencies', 'Anonymized scam data feeds', 'GPS heat maps & trends', 'API access + webhooks', 'Dedicated account manager'],
                cta: 'Contact Us', href: '/contact', featured: false },
            ].map(tier => (
              <div key={tier.name} className={`relative rounded-2xl p-6 flex flex-col ${
                tier.featured
                  ? 'bg-red-950/20 border-2 border-red-700 shadow-2xl'
                  : 'bg-[#1A1A1A] border border-gray-800'
              }`}>
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-700 text-white text-xs font-black px-4 py-1 rounded-full tracking-wider">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6 pt-2">
                  <div className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">{tier.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black">{tier.price}</span>
                    {tier.period && <span className="text-gray-500 text-sm mb-1">{tier.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={tier.href} className={`text-center py-3 rounded-xl font-bold text-sm transition-all ${
                  tier.featured
                    ? 'bg-red-700 hover:bg-red-800 text-white'
                    : 'border border-gray-700 hover:border-gray-500 text-white hover:bg-white/5'
                }`}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAW ENFORCEMENT */}
      <section id="law-enforcement" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-800/40 text-red-400 text-xs font-bold px-4 py-2 rounded-full mb-7 tracking-wider uppercase">
              🏛️ Law Enforcement Partnership
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-6">Partner with ScamShield LE</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Agencies that partner with ScamShield LE gain access to powerful, anonymized scam
              intelligence — helping you identify and disrupt scam operations faster.
            </p>
            <div className="space-y-5 mb-10">
              {[
                { icon: '📊', text: 'Anonymized scam pattern data from real reported calls in your jurisdiction' },
                { icon: '🗺️', text: 'GPS heat maps showing scam activity concentration by region and time' },
                { icon: '⚡', text: 'Real-time spike alerts when coordinated scam campaigns surge' },
                { icon: '🔌', text: 'REST API access for integration with existing agency tools and platforms' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-4">
                  <div className="text-2xl mt-0.5">{item.icon}</div>
                  <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://portal.scamshieldle.com"
                className="inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Access the LE Portal
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:bg-white/5 text-sm"
              >
                Request API Access
              </Link>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white">Agency Dashboard Preview</h3>
              <span className="text-xs text-gray-600">portal.scamshieldle.com</span>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-300">Active Scam Campaigns</span>
                <span className="inline-flex items-center gap-1.5 bg-red-950/50 text-red-400 text-xs font-bold px-2.5 py-0.5 rounded border border-red-900/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />LIVE
                </span>
              </div>
              <div className="text-4xl font-black text-white mb-1">14</div>
              <div className="text-xs text-gray-500">↑ 3 new in the past 24 hours</div>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-300 mb-4">Top Spoofed Numbers This Week</div>
              <div className="space-y-3">
                {[
                  { num: '+1 (202) 551-XXXX', count: '847 reports', pct: 85 },
                  { num: '+1 (800) 829-XXXX', count: '612 reports', pct: 62 },
                  { num: '+1 (866) 206-XXXX', count: '398 reports', pct: 40 },
                ].map(({ num, count, pct }) => (
                  <div key={num}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400 font-mono text-xs">{num}</span>
                      <span className="text-red-500 text-xs font-semibold">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-700/50 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-300 mb-3">Regional Activity Heat Map</div>
              <div className="grid grid-cols-10 gap-1">
                {[0,1,2,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,3,5,4,3,1,0,0,2,4,5,5,3,2,1,0,1,3,4,3,2,1,0].map((v,i) => (
                  <div key={i} className="h-3 rounded-sm" style={{ background: `rgba(211,47,47,${v === 0 ? 0.05 : v * 0.18})` }} />
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-2">Darker = higher scam density</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🛡️</span>
                <span className="font-black text-lg">ScamShield <span className="text-red-600">LE</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                Protecting communities from law enforcement impersonation scams
 with real-time AI detection and instant verified agency connections.
              </p>
              <div className="inline-flex flex-col bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3">
                <span className="text-xs text-gray-500 mb-0.5">FTC Scam Hotline</span>
                <a href="tel:18773824357" className="font-mono font-bold text-white hover:text-red-500 transition-colors tracking-wide">
                  1-877-382-4357
                </a>
                <span className="text-xs text-gray-600 mt-1">ReportFraud.ftc.gov</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-widest mb-5">Product</div>
              <ul className="space-y-3">
                {[
                  { l: 'Download App',     h: 'https://play.google.com/store' },
                  { l: 'How It Works',     h: '#how-it-works' },
                  { l: 'Detection Signals',h: '#signals' },
                  { l: 'Pricing',          h: '#pricing' },
                  { l: 'Family Dashboard', h: '#' },
                ].map(i => (
                  <li key={i.l}><a href={i.h} className="text-sm text-gray-500 hover:text-white transition-colors">{i.l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-widest mb-5">Legal &amp; Support</div>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</a></li>
                <li><Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="https://portal.scamshieldle.com" className="text-sm text-gray-500 hover:text-white transition-colors">LE Portal</a></li>
                <li><Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Request API Access</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">© 2025 ScamShield LE. Protecting communities from scam calls.</p>
            <p className="text-xs text-gray-700">Not affiliated with any government agency.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

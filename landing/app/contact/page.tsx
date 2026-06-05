'use client'

import { useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'sending' | 'success' | 'error'

const SUBJECTS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'le',      label: 'Law Enforcement Partnership' },
  { value: 'api',     label: 'API Access Request' },
  { value: 'press',   label: 'Press / Media' },
  { value: 'bug',     label: 'Bug Report' },
]

const baseInput =
  'w-full bg-[#0A0A0A] border border-gray-700 focus:border-gray-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600'
const errInput =
  'w-full bg-[#0A0A0A] border border-red-700 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600'

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', subject: 'general', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
  }

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="font-black">ScamShield <span className="text-red-600">LE</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">&larr; Back to home</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-black mb-4">Get in Touch</h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">Whether you&apos;re a law enforcement agency, a journalist, or just have a question, we&apos;d love to hear from you.</p>
            <div className="mt-10 p-4 bg-[#1A1A1A] border border-gray-800 rounded-xl">
              <div className="text-xs text-gray-500 mb-1">Email us directly</div>
              <a href="mailto:contact@scamshieldle.com" className="text-white font-semibold hover:text-red-500 transition-colors">contact@scamshieldle.com</a>
            </div>
          </div>
          <div>
            {status === 'success' ? (
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-3xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-black mb-3">Message Sent!</h2>
                <p className="text-gray-400 text-sm mb-6">Thanks for reaching out. We typically respond within 1&ndash;2 business days.</p>
                <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: 'general', message: '' }); setErrors({}) }} className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-gray-800 rounded-3xl p-8 space-y-5">
                <div><label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label><input id="name" type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} className={errors.name ? errInput : baseInput} />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                <div><label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address <span className="text-red-500">*</span></label><input id="email" type="email" placeholder="jane@agency.gov" value={form.email} onChange={set('email')} className={errors.email ? errInput : baseInput} />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                <div><label htmlFor="subject" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label><select id="subject" value={form.subject} onChange={set('subject')} className="w-full bg-[#0A0A0A] border border-gray-700 focus:border-gray-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors">{SUBJECTS.map(s => (<option key={s.value} value={s.value}>{s.label}</option>))}</select></div>
                <div><label htmlFor="message" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message <span className="text-red-500">*</span></label><textarea id="message" rows={5} placeholder="Tell us how we can help…" value={form.message} onChange={set('message')} className={errors.message ? errInput : baseInput} />{errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}</div>
                <button type="submit" disabled={status === 'sending'} className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-sm">{status === 'sending' ? 'Sending…' : 'Send Message'}</button>
                <p className="text-xs text-gray-600 text-center">We typically respond within 1&ndash;2 business days.</p>
              </form>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-900 px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">&copy; 2025 ScamShield LE.</p>
          <div className="flex gap-6 text-sm text-gray-600"><Link href="/" className="hover:text-white transition-colors">Home</Link><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></div>
        </div>
      </footer>
    </div>
  )
}

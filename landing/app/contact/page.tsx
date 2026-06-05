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

export default function ContactPage() {
  return (<div>Contact Page</div>)
}

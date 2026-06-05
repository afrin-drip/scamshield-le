import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name, email, subject, message } = body as Record<string, string>;
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim())
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  if (name.length > 120 || subject.length > 200 || message.length > 5000)
    return NextResponse.json({ error: 'Input exceeds maximum length' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL;
  if (!apiKey || !toEmail)
    return NextResponse.json({ error: 'Contact form not configured' }, { status: 500 });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: 'ScamShield LE Contact <noreply@scamshieldle.com>',
    to: toEmail,
    subject: `[ScamShield LE Contact] ${subject.trim()}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<hr/>
<p>${escapeHtml(message).replace(/\n/g,'<br/>')}</p>`,
  });
  if (error) return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
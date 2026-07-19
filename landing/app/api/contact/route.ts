import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, message, phone } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0)
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  if (!email || typeof email !== "string" || !isValidEmail(email.trim()))
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 }
    );

  if (!message || typeof message !== "string" || message.trim().length < 10)
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400 }
    );

  try {
    await resend.emails.send({
      from: "ScamShield LE <noreply@scamshieldle.com>",
      to: "t3@verreauxgroup.com",
      replyTo: email.trim(),
      subject: `New contact form submission from ${name.trim()}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone.trim()}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message.trim()}</p>
      `,
      text: [
        "New Contact Form Submission",
        "",
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        phone ? `Phone: ${phone.trim()}` : null,
        "",
        "Message:",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact/route] Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

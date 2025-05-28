/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with server-side API key
const sendgridApiKey = process.env.SENDGRID_API_KEY!;
sgMail.setApiKey(sendgridApiKey);

export async function POST(request: Request) {
  try {
    const { email, subject, html } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      html,
    };

    await sgMail.send(msg);
        
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error?.response?.body || error);
        
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
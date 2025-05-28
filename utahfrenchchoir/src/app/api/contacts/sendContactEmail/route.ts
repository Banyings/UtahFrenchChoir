// Send message after a successful submission
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/sendContactEmail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

// Initialize SendGrid with environment variables
const sendgridApiKey = process.env.SENDGRID_API_KEY!;
sgMail.setApiKey(sendgridApiKey);

// Initialize Supabase with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, message } = body;

    // Validate request data
    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (message.length > 300) {
      return NextResponse.json(
        { error: 'Message exceeds maximum length of 300 characters' },
        { status: 400 }
      );
    }

    // Store contact in Supabase database
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          message,
          status: 'new'
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to store contact information' },
        { status: 500 }
      );
    }

    // Send notification email to administrators
    const adminMsg = {
      to: process.env.ADMIN_EMAIL!,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send confirmation email to the user
    const userMsg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${fullName},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>Utah Choir Team</p>
      `,
    };

    // Send emails via SendGrid
    try {
      await sgMail.send(adminMsg);
      await sgMail.send(userMsg);
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      // Continue execution - we don't want to fail the request if only email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
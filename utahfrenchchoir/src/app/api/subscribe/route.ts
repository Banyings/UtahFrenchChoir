/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Initialize Supabase client (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';// supabase key goes here
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''; // server-side service key goes here
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize SendGrid
const sendgridApiKey = process.env.SENDGRID_API_KEY || ''; //sendgrid key goes here
sgMail.setApiKey(sendgridApiKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate allowed domains
    const allowedDomains = ['gmail.com', 'yahoo.fr'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!domain || !allowedDomains.includes(domain)) {
      return NextResponse.json(
        { error: 'Only Gmail or Yahoo.fr email addresses are allowed' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
        return NextResponse.json(
          { error: 'You are already subscribed with this email' },
          { status: 400 }
        );
      } else {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Subscription failed' },
          { status: 500 }
        );
      }
    }

    // Send confirmation email
    const msg = {
      to: email,
      from: '',// the verified sendgrid email goes here
      subject: 'Thanks for Subscribing to Utah French Choir!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2F855A; text-align: center;">Welcome to Utah French Choir! 🎵</h1>
          <p>Dear Subscriber,</p>
          <p>Thank you for joining our community! We're excited to have you as part of our choir family.</p>
          <p>Stay tuned for upcoming events, rehearsal schedules, and special performances.</p>
          <div style="background-color: #F0FFF4; border-left: 4px solid #2F855A; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;">We combine cultures to enhance our voices together and our testimonies of the Lord. We sing for God and for others to join and become better.</p>
          </div>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Harmoniously yours,<br>The Utah French Choir Team</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
    } catch (emailError: any) {
      console.error('Error sending confirmation email:', emailError?.response?.body || emailError);
      // Still return success since the subscription worked
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error, please try again later' },
      { status: 500 }
    );
  }
}
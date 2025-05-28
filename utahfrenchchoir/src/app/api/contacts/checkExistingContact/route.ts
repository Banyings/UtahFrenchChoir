// Check exixting contacts to not have mutliple inquiries for one person
// app/api/checkExistingContact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone } = body;

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone are required' },
        { status: 400 }
      );
    }

    // Check if a contact with the same email or phone exists in Supabase
    const { data, error } = await supabase
      .from('contacts')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to check existing contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data
    });
  } catch (error) {
    console.error('Error checking existing contact:', error);
    return NextResponse.json(
      { error: 'Failed to check existing contact' },
      { status: 500 }
    );
  }
}
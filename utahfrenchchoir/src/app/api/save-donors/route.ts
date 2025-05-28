// app/api/save-donor/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// TypeScript interfaces
interface DonorRequestBody {
  fullName?: string;
  email: string;
  phone?: string;
  message?: string;
  amount: number;
  donationType: 'one-time' | 'monthly';
  paymentMethod: 'card' | 'venmo' | 'cashapp';
  status?: string;
  timestamp?: string;
}

// Create Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: DonorRequestBody = await request.json();
    
    const { 
      fullName, 
      email, 
      phone, 
      message, 
      amount, 
      donationType, 
      paymentMethod 
    } = body;

    // Log the incoming request for debugging
    console.log('Received donor data:', { 
      fullName, 
      email, 
      phone: phone ? 'provided' : 'not provided',
      message: message ? 'provided' : 'not provided',
      amount, 
      donationType, 
      paymentMethod 
    });

    // Validate required fields
    if (!email || !amount || !donationType || !paymentMethod) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: email, amount, donationType, and paymentMethod are required'
        },
        { status: 400 }
      );
    }

    // Additional validation for Venmo/CashApp
    if ((paymentMethod === 'venmo' || paymentMethod === 'cashapp') && !fullName) {
      return NextResponse.json(
        { 
          error: 'Full name is required for Venmo and Cash App donations'
        },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { 
          error: 'Amount must be a positive number'
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!['card', 'venmo', 'cashapp'].includes(paymentMethod)) {
      return NextResponse.json(
        { 
          error: 'Invalid payment method. Must be card, venmo, or cashapp'
        },
        { status: 400 }
      );
    }

    // Validate donation type
    if (!['one-time', 'monthly'].includes(donationType)) {
      return NextResponse.json(
        { 
          error: 'Invalid donation type. Must be one-time or monthly'
        },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const donorData = {
      full_name: fullName || null,
      email: email.toLowerCase().trim(),
      phone: phone || null,
      message: message || null,
      amount: parseFloat(amount.toString()),
      donation_type: donationType,
      payment_method: paymentMethod,
      status: paymentMethod === 'card' ? 'completed' : 'pending',
      created_at: new Date().toISOString()
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('donors')
      .insert([donorData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to save donor information to database',
          details: error.message 
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { 
          error: 'No data returned from database'
        },
        { status: 500 }
      );
    }

    console.log('Successfully saved donor:', data[0]);

    // Return success response
    return NextResponse.json({
      success: true,
      donor: data[0],
      message: 'Donor information saved successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
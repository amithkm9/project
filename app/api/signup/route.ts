// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase';

interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SignupRequest = await request.json();
    const { fullName, email, password } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate full name
    if (fullName.trim().length < 2) {
      return NextResponse.json(
        { message: 'Full name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Clean and normalize data
    const cleanFullName = fullName.trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseServer
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const { data: newUser, error: insertError } = await supabaseServer
      .from('users')
      .insert({
        full_name: cleanFullName,
        email: cleanEmail,
        password_hash: passwordHash,
      })
      .select('id, full_name, email, created_at')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Handle specific database errors
      if (insertError.code === '23505') {
        return NextResponse.json(
          { message: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { message: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Return success response (without password hash)
    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          fullName: newUser.full_name,
          email: newUser.email,
          createdAt: newUser.created_at,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
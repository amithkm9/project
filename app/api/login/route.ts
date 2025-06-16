// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
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

    // Clean and normalize data
    const cleanEmail = email.toLowerCase().trim();

    // Find user by email
    const { data: user, error: userError } = await supabaseServer
      .from('users')
      .select('id, full_name, email, password_hash, age')
      .eq('email', cleanEmail)
      .single();

    if (userError || !user) {
      console.error('User lookup error:', userError);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last activity in user_progress if exists
    try {
      const { error: progressError } = await supabaseServer
        .from('user_progress')
        .update({
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (progressError) {
        console.warn('Failed to update user progress:', progressError);
        // Don't fail login if progress update fails
      }
    } catch (progressErr) {
      console.warn('Progress update failed:', progressErr);
      // Continue with successful login
    }

    // Return success response (without password hash)
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          age: user.age,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
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
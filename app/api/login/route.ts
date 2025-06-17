// app/api/login/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    console.log('🔍 Login attempt for email:', email);

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    console.log('🔍 Searching for user in database:', cleanEmail);

    try {
      // Find user by email in Supabase
      const { data: user, error: userError } = await supabaseServer
        .from('users')
        .select('id, full_name, email, password_hash, age')
        .eq('email', cleanEmail)
        .single();

      console.log('📡 Database query result:', { 
        found: !!user, 
        error: userError?.message,
        userEmail: user?.email 
      });

      if (userError && userError.code !== 'PGRST116') {
        console.error('❌ Database error:', userError);
        return NextResponse.json(
          { message: 'Database error occurred' },
          { status: 500 }
        );
      }

      if (!user) {
        console.log('❌ User not found in database');
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('✅ User found, verifying password...');
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      console.log('🔐 Password verification result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('❌ Password verification failed');
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('✅ Login successful for:', user.email);

      // Update last activity in user_progress table
      try {
        await supabaseServer
          .from('user_progress')
          .upsert({
            user_id: user.id,
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });
      } catch (progressErr) {
        console.warn('⚠️ Progress update failed:', progressErr);
      }

      // Return successful response
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          age: user.age,
        },
      }, { status: 200 });

    } catch (dbError) {
      console.error('❌ Database connection error:', dbError);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Login error:', error);
    
    return NextResponse.json(
      { 
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
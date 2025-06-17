// app/api/login/route.ts - FIXED VERSION without invalid count query
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
      // Find user by email - simplified query without count(*)
      const { data: users, error: userError } = await supabaseServer
        .from('users')
        .select('id, full_name, email, password_hash, age')
        .eq('email', cleanEmail)
        .limit(1);

      console.log('📡 Database query result:', { 
        found: users && users.length > 0, 
        count: users?.length || 0,
        error: userError?.message,
        userEmail: users?.[0]?.email
      });

      if (userError) {
        console.error('❌ Database error:', userError);
        return NextResponse.json(
          { message: 'Database error occurred', error: userError.message },
          { status: 500 }
        );
      }

      // Handle no users found
      if (!users || users.length === 0) {
        console.log('❌ User not found in database');
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const user = users[0];
      console.log('✅ User found, verifying password...');
      
      // Verify password
      let isPasswordValid = false;
      
      try {
        isPasswordValid = await bcrypt.compare(password, user.password_hash);
      } catch (bcryptError) {
        console.error('❌ Password comparison failed:', bcryptError);
        return NextResponse.json(
          { message: 'Password verification failed' },
          { status: 500 }
        );
      }
      
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
        const { error: progressError } = await supabaseServer
          .from('user_progress')
          .upsert({
            user_id: user.id,
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (progressError) {
          console.warn('⚠️ Progress update failed:', progressError);
        } else {
          console.log('✅ Progress updated successfully');
        }
      } catch (progressErr) {
        console.warn('⚠️ Progress update error:', progressErr);
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
        { message: 'Database connection failed', error: String(dbError) },
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
// contexts/AuthContext.tsx - FIXED VERSION
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async (supabaseUserId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, full_name, email, age')
        .eq('id', supabaseUserId)
        .single();

      if (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }

      return {
        id: userData.id,
        fullName: userData.full_name,
        email: userData.email,
        age: userData.age,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      // First check localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        return;
      }

      // Then check Supabase
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (supabaseUser) {
        const userData = await fetchUserData(supabaseUser.id);
        if (userData) {
          setUser(userData);
          setSupabaseUser(supabaseUser);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user...');
      
      // Clear local state first
      setUser(null);
      setSupabaseUser(null);
      localStorage.removeItem('user');
      
      // Then try to sign out from Supabase (optional since we use localStorage)
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Supabase sign out error (non-critical):', error);
        }
      } catch (supabaseError) {
        console.warn('Supabase sign out failed (non-critical):', supabaseError);
      }

      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        // First priority: Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('✅ Found stored user data:', userData.email);
            setUser(userData);
            setLoading(false);
            return;
          } catch (error) {
            console.error('❌ Failed to parse stored user data:', error);
            localStorage.removeItem('user');
          }
        }

        // Second priority: Check Supabase session
        console.log('🔍 Checking Supabase session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
        }
        
        if (session?.user) {
          console.log('✅ Found Supabase session');
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUser(userData);
            setSupabaseUser(session.user);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          console.log('ℹ️ No Supabase session found');
        }
      } catch (error) {
        console.error('❌ Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (Supabase only)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUser(userData);
            setSupabaseUser(session.user);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else if (event === 'SIGNED_OUT') {
          // Only clear if it wasn't manually cleared already
          const storedUser = localStorage.getItem('user');
          if (!storedUser) {
            setUser(null);
            setSupabaseUser(null);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    supabaseUser,
    loading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
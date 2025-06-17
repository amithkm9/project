// components/login-form.tsx - UPDATED VERSION with better validation
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    age: number;
  };
}

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loginStatus, setLoginStatus] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginStatus('Checking credentials...');

    try {
      console.log('🚀 Attempting login with:', { email: formData.email });

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        }),
      });

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Validate response data
      if (!data.user || !data.user.id || !data.user.fullName || !data.user.email) {
        throw new Error('Invalid response data from server');
      }

      setLoginStatus('Login successful! Storing user data...');

      // Store user data in localStorage
      console.log('💾 Storing user data:', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Verify storage worked
      const storedData = localStorage.getItem('user');
      if (!storedData) {
        throw new Error('Failed to store user data');
      }

      setLoginStatus('Redirecting to dashboard...');

      // Show success message
      toast.success(`Welcome back, ${data.user.fullName}!`);
      
      console.log('🏠 Redirecting to /home...');
      
      // Use window.location.href for immediate redirect
      window.location.href = '/home';

    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
      setLoginStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@edusign.com',
      password: 'demo123456'
    });
    toast.info('Demo credentials filled in! Click Sign In to continue.');
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    setLoginStatus('Logging in with demo account...');
    
    try {
      // Set demo credentials
      const demoData = {
        email: 'demo@edusign.com',
        password: 'demo123456'
      };

      console.log('🚀 Quick demo login...');
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Demo login failed');
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Welcome to the demo, ${data.user.fullName}!`);
      
      setLoginStatus('Demo login successful! Redirecting...');
      
      // Force redirect
      window.location.href = '/home';

    } catch (error) {
      console.error('❌ Demo login error:', error);
      toast.error('Demo login failed. Please try again.');
      setLoginStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-full w-fit">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Status Message */}
          {loginStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                {loginStatus}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                onClick={() => toast.info('Password reset feature coming soon!')}
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 bg-white px-2">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Fill Demo Credentials
            </Button>

            <Button
              type="button"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleQuickDemo}
              disabled={isLoading}
            >
              🚀 Quick Demo Login
            </Button>
          </div>

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">
              <div><strong>Demo Email:</strong> demo@edusign.com</div>
              <div><strong>Demo Password:</strong> demo123456</div>
              <div className="mt-2 text-blue-600">
                Make sure this user exists in your Supabase database!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// app/login/page.tsx
import { LoginForm } from '@/components/login-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Hand, Users, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Hand className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              EduSign
            </span>
          </Link>
          
          <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Information */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Continue Your
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Learning Adventure
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Welcome back! Sign in to access your personalized courses, 
              track your progress, and continue mastering sign language with our AI-powered platform.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Active Learners</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                  <Trophy className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Lessons Completed</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Quick Access Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 lg:justify-start justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Resume your current course</span>
              </div>
              <div className="flex items-center gap-3 lg:justify-start justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Check your learning streak</span>
              </div>
              <div className="flex items-center gap-3 lg:justify-start justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700">Access new personalized lessons</span>
              </div>
            </div>

            {/* Success Story */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Success story"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-600 italic mb-2">
                    "I've been using EduSign for 6 months now and I'm amazed at how much I've learned. 
                    The AI feedback keeps me motivated and helps me improve every day!"
                  </p>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">Marcus Johnson</div>
                    <div className="text-gray-600">Advanced Learner • 180-day streak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-600">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </footer>
    </div>
  );
}
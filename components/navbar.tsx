// components/navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Hand, Menu, X, User, LogOut, Home, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface NavbarProps {
  user?: User | null;
}

export function Navbar({ user }: NavbarProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? "/home" : "/"} className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Hand className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              EduSign
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              // Authenticated user navigation
              <>
                <Link 
                  href="/home" 
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/courses" 
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                </Link>
                
                {/* User dropdown */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.fullName}</span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              // Guest navigation
              <>
                <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </Link>
                <Link href="#teachers" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Teachers
                </Link>
                <Link href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Testimonials
                </Link>
                <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
                
                <div className="flex items-center space-x-4">
                  <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {user ? (
                // Authenticated mobile navigation
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  
                  <Link 
                    href="/home" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/courses" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </Link>
                  
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="flex items-center gap-2 mx-4 justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                // Guest mobile navigation
                <>
                  <Link 
                    href="#about" 
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="#teachers" 
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Teachers
                  </Link>
                  <Link 
                    href="#testimonials" 
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link 
                    href="#contact" 
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  
                  <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="justify-start bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
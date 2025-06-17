// components/navbar.tsx - Simplified without authentication
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Hand, Menu, X, Home, BookOpen, Camera, Languages, Play } from 'lucide-react';

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

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Hand className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              EduSign
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/home" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              Courses
            </Link>
            <Link 
              href="/tutorials" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Play className="h-4 w-4" />
              Tutorials
            </Link>
            <Link 
              href="/numbers-letters" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Recognition
            </Link>
            <Link 
              href="/translate" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Languages className="h-4 w-4" />
              Translate
            </Link>
            
            {user && (
              <div className="flex items-center gap-2 text-gray-700 bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className="text-xs text-blue-600">Age {user.age}</span>
              </div>
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
              {user && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-sm text-blue-600">Age {user.age}</span>
                  </div>
                </div>
              )}
              
              <Link 
                href="/home" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Courses
              </Link>
              <Link 
                href="/tutorials" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Play className="h-4 w-4" />
                Tutorials
              </Link>
              <Link 
                href="/numbers-letters" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Camera className="h-4 w-4" />
                Recognition
              </Link>
              <Link 
                href="/translate" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Languages className="h-4 w-4" />
                Translate
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
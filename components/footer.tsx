import Link from 'next/link';
import { Hand } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Hand className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EduSign</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering inclusive education through AI-powered sign language learning. 
              Breaking barriers and building bridges in the deaf and hard-of-hearing community.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-colors">
                <div className="w-5 h-5 bg-blue-500 rounded"></div>
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-colors">
                <div className="w-5 h-5 bg-teal-500 rounded"></div>
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-colors">
                <div className="w-5 h-5 bg-purple-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#teachers" className="text-gray-400 hover:text-white transition-colors">Teachers</Link></li>
              <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 EduSign. All rights reserved. Made with ❤️ for inclusive education.
          </p>
        </div>
      </div>
    </footer>
  );
}
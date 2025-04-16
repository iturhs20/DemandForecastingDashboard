'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Home, BarChart2, Users, Settings, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`h-screen bg-gradient-to-b from-gray-900 to-blue-950 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } relative`}
      >
        {/* Sidebar Header - Logo & Toggle Button */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-950 w-full flex items-center justify-between py-5 px-4">
          {/* Logo */}
          <div className={`transition-all duration-300 ${isOpen ? 'ml-0' : '-ml-2'}`}>
            <Image
              src="/yunometa.png" // Replace with actual logo path
              alt="Company Logo"
              width={isOpen ? 140 : 40}
              height={40}
              className="transition-all duration-300"
            />
          </div>
        </div>

        {/* Toggle button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-16 bg-blue-800 rounded-full p-1 border border-blue-700 shadow-md hover:shadow-lg transition-all"
        >
          {isOpen ? 
            <ChevronLeft className="w-4 h-4 text-white" /> : 
            <ChevronRight className="w-4 h-4 text-white" />
          }
        </button>

        {/* Navigation Links */}
        <nav className="mt-6 px-3 space-y-1">
          <Link
            href="/"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all font-medium ${
              pathname === '/' ? 'bg-[#264158] text-white' : 'text-gray-300 hover:bg-[#26435B] hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 min-w-5" />
            {isOpen && <span>Dashboard</span>}
          </Link>
          
          <Link
            href="/shortsales"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              pathname === '/shortsales' ? 'bg-[#264158] text-white font-medium' : 'text-gray-300 hover:bg-[#26435B] hover:text-white'
            }`}
          >
            <BarChart2 className="w-5 h-5 min-w-5" />
            {isOpen && <span>Short Sales</span>}
          </Link>
          
          <Link
            href="/lifecycle"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              pathname === '/lifecycle' ? 'bg-[#264158] text-white font-medium' : 'text-gray-300 hover:bg-[#26435B] hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5 min-w-5" />
            {isOpen && <span>MicroMarketing Strategy</span>}
          </Link>
          
          <Link
            href="/settings"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              pathname === '/settings' ? 'bg-[#264158] text-white font-medium' : 'text-gray-300 hover:bg-[#26435B] hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 min-w-5" />
            {isOpen && <span>Settings</span>}
          </Link>
        </nav>
        
        {/* User profile section at bottom */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="border-t border-blue-800 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
                  YM
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Admin User</div>
                  <div className="text-xs text-gray-400">admin@yunometa.com</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
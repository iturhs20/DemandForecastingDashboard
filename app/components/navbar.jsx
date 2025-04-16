'use client';

import { Search, Bell, Mail, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-5 border-b border-blue-800" style={{ backgroundColor: '#002644' }}>
      
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200" />
        <input
          type="text"
          placeholder="Search dashboards, reports, metrics..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-700 text-white placeholder-blue-300 focus:outline-none text-sm transition-all"
          style={{ backgroundColor: '#001e38', borderColor: '#4B72B7', boxShadow: 'none' }}
        />
      </div>

      {/* Icons & User Profile */}
      <div className="flex items-center space-x-1 md:space-x-4">
        {/* Notification Badge */}
        <div className="relative p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition-all">
          <Bell className="w-5 h-5 text-blue-200" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#4B72B7' }}>3</span>
        </div>
        
        {/* Mail Badge */}
        <div className="relative p-2 rounded-lg hover:bg-blue-900 cursor-pointer transition-all">
          <Mail className="w-5 h-5 text-blue-200" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#4B72B7' }}>5</span>
        </div>
      </div>
    </nav>
  );
}
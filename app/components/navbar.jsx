'use client';

import { Search, Bell, Mail, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-100 h-31">
      
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search dashboards, reports, metrics..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm transition-all"
        />
      </div>

      {/* Icons & User Profile */}
      <div className="flex items-center space-x-1 md:space-x-4">
        {/* Notification Badge */}
        <div className="relative p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">3</span>
        </div>
        
        {/* Mail Badge */}
        <div className="relative p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
          <Mail className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">5</span>
        </div>
      </div>
    </nav>
  );
}
import React from 'react'

function Hero() {
  return (
    <div className="w-full overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
        <div className="bg-white/95 backdrop-blur-sm m-1 rounded-xl">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Left side with text content */}
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Welcome to Yunometa <span className="text-blue-600">Demand Forecasting</span>
                </h2>
                
                <p className="text-gray-600 max-w-2xl">
                  This interactive dashboard helps you easily track, analyze, and forecast demand trends across your products, services, and regions with powerful AI-driven insights.
                </p>
              </div>
              
              {/* Right side with decorative elements */}
              <div className="hidden sm:flex items-center justify-center">
                <div className="w-36 h-36 relative">
                  <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full animate-pulse"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 bg-blue-600 rounded-full"></div>
                  <div className="absolute bottom-6 right-8 w-10 h-10 bg-indigo-600 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
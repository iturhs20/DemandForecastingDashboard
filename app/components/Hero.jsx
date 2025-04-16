import React from 'react'

function Hero() {
  return (
    <div className="w-full overflow-hidden">
      <div className="bg-gradient-to-r from-[#024673] via-[#5C99E3] to-[#756CE5] rounded-2xl shadow-xl">
        <div className="bg-opacity-15 backdrop-blur-sm m-1 rounded-xl" style={{ backgroundColor: 'rgba(2, 70, 115, 0.15)' }}>
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              {/* Left side with text content */}
              <div className="flex-1 space-y-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  Welcome to Yunometa <span className="text-white">Demand Forecasting</span>
                </h2>
                
                <p className="text-blue-50 max-w-2xl text-lg">
                  This interactive dashboard helps you easily track, analyze, and forecast demand trends across your products, services, and regions with powerful AI-driven insights.
                </p>
                
                <button className="mt-2 px-6 py-3 bg-white text-[#024673] font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
              
              {/* Right side with enhanced decorative elements */}
              <div className="hidden sm:flex items-center justify-center">
                <div className="w-40 h-40 relative">
                  <div className="absolute inset-0 bg-[#5C99E3] opacity-20 rounded-full animate-pulse"></div>
                  <div className="absolute top-4 left-4 w-10 h-10 bg-[#024673] rounded-full shadow-lg"></div>
                  <div className="absolute bottom-6 right-8 w-12 h-12 bg-[#756CE5] rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#024673]">
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
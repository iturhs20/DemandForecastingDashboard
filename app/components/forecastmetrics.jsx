'use client';

import { TrendingUp, Award, AlertCircle } from 'lucide-react';

export default function ForecastMetrics({ 
  isLoading, 
  totalForecast = 0, 
  accuracyRate = 0 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Total Forecast Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Forecast</p>
            {isLoading ? (
              <div className="h-8 w-28 bg-gray-200 animate-pulse rounded-md mt-1"></div>
            ) : (
              <h3 className="text-3xl font-bold mt-1 text-gray-900">{totalForecast.toLocaleString()}</h3>
            )}
            
            <div className="mt-4 flex items-center">
              {isLoading ? (
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-md"></div>
              ) : (
                <>
                  <div className="flex items-center text-gray-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Forecast Total</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
      
      {/* Accuracy Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Average Accuracy</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md mt-1"></div>
            ) : (
              <h3 className="text-3xl font-bold mt-1 text-gray-900">{accuracyRate}%</h3>
            )}
            
            <div className="mt-4 flex items-center">
              {isLoading ? (
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-md"></div>
              ) : (
                <>
                  <div className="flex items-center text-gray-500">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Forecast Accuracy</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-lg">
            <Award className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
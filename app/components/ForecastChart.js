import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Calendar, Download, RefreshCcw } from 'lucide-react';

const ForecastChart = ({ 
  isLoading,
  yearlyData = [],
  quarterlyData = []
}) => {
  const [chartView, setChartView] = useState('yearly');
  const [chartType, setChartType] = useState('line');
  
  // Choose which data to display based on selected view
  const chartData = chartView === 'yearly' ? yearlyData : quarterlyData;
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="font-medium text-lg text-gray-800">Forecast vs Actual</h3>
        
        <div className="flex mt-4 sm:mt-0 space-x-2">
          {/* View toggle */}
          <div className="bg-gray-100 rounded-lg p-1 flex text-sm">
            <button 
              onClick={() => setChartView('yearly')}
              className={`px-3 py-1 rounded-md transition-all ${
                chartView === 'yearly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
            </button>
            <button 
              onClick={() => setChartView('quarterly')}
              className={`px-3 py-1 rounded-md transition-all ${
                chartView === 'quarterly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Quarterly
            </button>
          </div>
          
          {/* Chart type toggle */}
          <div className="bg-gray-100 rounded-lg p-1 flex text-sm">
            <button 
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md transition-all ${
                chartType === 'line' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Line
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md transition-all ${
                chartType === 'bar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bar
            </button>
          </div>
          
          {/* Action buttons */}
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-96">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">No data available for the selected filters</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey={chartView === 'yearly' ? 'Year' : 'YearQuarter'} 
                  tick={{ fontSize: 12 }}
                  angle={chartView === 'quarterly' ? -45 : 0}
                  textAnchor={chartView === 'quarterly' ? 'end' : 'middle'}
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="Forecast" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Actual" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey={chartView === 'yearly' ? 'Year' : 'YearQuarter'} 
                  tick={{ fontSize: 12 }}
                  angle={chartView === 'quarterly' ? -45 : 0}
                  textAnchor={chartView === 'quarterly' ? 'end' : 'middle'}
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="Forecast" fill="#4F46E5" barSize={chartView === 'quarterly' ? 15 : 30} />
                <Bar dataKey="Actual" fill="#10B981" barSize={chartView === 'quarterly' ? 15 : 30} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ForecastChart;
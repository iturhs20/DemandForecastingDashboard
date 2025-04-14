import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, Download, RefreshCcw, Filter } from 'lucide-react';

const ForecastChart = ({ 
  isLoading,
  yearlyData = [],
  quarterlyData = [],
  monthlyData = [],
  selectedMonth = 'All',
  selectedYear = 'All'
}) => {
  const [chartView, setChartView] = useState('yearly');
  
  // Effect to handle filter changes - select appropriate view when specific filters are selected
  useEffect(() => {
    if (selectedMonth !== 'All') {
      setChartView('yearly');
    }
  }, [selectedMonth]);
  
  // Choose data based on view and filters
  const getChartData = () => {
    let filteredData;
    
    switch(chartView) {
      case 'yearly':
        // Use provided monthly data or fall back to yearly data if monthly is not available
        filteredData = monthlyData && monthlyData.length > 0 ? monthlyData : yearlyData;
        
        // Apply year filter if selected
        if (selectedYear !== 'All') {
          filteredData = filteredData.filter(item => item.Year === selectedYear.toString());
        }
        
        // Apply month filter if selected
        if (selectedMonth !== 'All') {
          const shortMonthName = Object.entries({
            'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 
            'April': 'Apr', 'May': 'May', 'June': 'Jun',
            'July': 'Jul', 'August': 'Aug', 'September': 'Sep', 
            'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
          }).find(([long]) => long === selectedMonth)?.[1];
          
          if (shortMonthName) {
            filteredData = filteredData.filter(item => item.Month === shortMonthName);
          }
        }
        break;
        
      case 'quarterly':
        filteredData = quarterlyData;
        // Apply year filter if needed
        if (selectedYear !== 'All') {
          filteredData = filteredData.filter(item => {
            if (!item.YearQuarter) return false;
            return item.YearQuarter.startsWith(selectedYear);
          });
        }
        break;
        
      default: // yearly fallback
        filteredData = yearlyData;
        if (selectedYear !== 'All') {
          filteredData = filteredData.filter(item => item.Year === selectedYear.toString());
        }
        break;
    }
    
    return filteredData;
  };
  
  const chartData = getChartData();
  
  // Check if we need to show the forecast line by verifying at least one data point has a non-zero Forecast value
  const showForecastLine = chartData.some(item => item.Forecast && item.Forecast > 0);
  
  // Create a modified data array with a connecting point if needed
  const processedChartData = () => {
    if (!showForecastLine) return chartData;
    
    // Find transition point - last point with Fitted data before Forecast starts
    const transitionIndex = chartData.findIndex((item, index, array) => {
      // Look for the point where we transition from Fitted to Forecast
      const nextItem = index < array.length - 1 ? array[index + 1] : null;
      return (
        item.Fitted > 0 && 
        nextItem &&
        nextItem.Forecast > 0 &&
        nextItem.Fitted === 0 &&
        nextItem.Actual === 0
      );
    });
    
    if (transitionIndex < 0) return chartData;
    
    // Create a deep copy of the data
    const newData = [...chartData];
    
    // For the transition point, ensure it has both fitted and forecast values
    // This creates the connection between the two lines
    if (transitionIndex >= 0 && transitionIndex < newData.length - 1) {
      if (newData[transitionIndex + 1].Forecast > 0) {
        // Mark this data point as a connection point for the tooltip to identify
        newData[transitionIndex].isConnectionPoint = true;
        // Set Forecast value at connection point
        newData[transitionIndex].Forecast = newData[transitionIndex].Fitted;
      }
    }
    
    return newData;
  };
  
  const finalChartData = processedChartData();
  
  // Custom tooltip formatter - Modified to handle connection points specially
  // Removed variance percentage display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Format the label differently based on the data type
      let displayLabel = label;
      if (payload[0]?.payload?.YearMonth) {
        displayLabel = payload[0].payload.YearMonth;
      }
      
      // Check if this is a connection point
      const isConnectionPoint = payload[0]?.payload?.isConnectionPoint;
      
      // If it's a connection point, filter out the Forecast entry
      let displayPayload = payload;
      if (isConnectionPoint) {
        displayPayload = payload.filter(entry => 
          entry.dataKey !== 'Forecast' && entry.name !== 'Forecast'
        );
      }
      
      return (
        <div className="bg-white p-4 border shadow-sm rounded-md">
          <p className="font-medium">{displayLabel}</p>
          {displayPayload.map((entry, index) => (
            entry.value !== null && entry.value !== undefined && 
            <p key={index} style={{ color: entry.color }} className="flex justify-between">
              <span>{entry.name}: </span>
              <span className="ml-4 font-medium">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Show different title based on selected filters
  const getChartTitle = () => {
    let title = "Fitted vs Actual";
    
    if (showForecastLine) {
      title = "Fitted vs Actual with Forecast";
    }
    
    if (selectedYear !== 'All' && selectedMonth !== 'All') {
      title += ` • ${selectedMonth} ${selectedYear}`;
    } else if (selectedMonth !== 'All') {
      title += ` • ${selectedMonth}`;
    } else if (selectedYear !== 'All') {
      title += ` • ${selectedYear}`;
    }
    
    return title;
  };
  
  // Determine if filters are active
  const isFilterActive = selectedMonth !== 'All' || selectedYear !== 'All';
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-lg text-gray-800">{getChartTitle()}</h3>
          {isFilterActive && (
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" />
              Filtered view
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap mt-4 sm:mt-0 gap-2">
          {/* View toggle - disabled when month filter is active */}
          <div className="bg-gray-100 rounded-lg p-1 flex text-sm">
            <button 
              onClick={() => setChartView('yearly')}
              className={`px-3 py-1 rounded-md transition-all ${
                chartView === 'yearly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              disabled={selectedMonth !== 'All'}
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
              disabled={selectedMonth !== 'All'}
            >
              Quarterly
            </button>
          </div>
          
          {/* Action buttons */}
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
        ) : finalChartData.length === 0 ? (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">No data available for the selected filters</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={finalChartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              {chartView === 'yearly' ? (
                <XAxis 
                  dataKey="YearMonth"
                  type="category"
                  allowDuplicatedCategory={false}
                  tick={{ fontSize: 12 }}
                  interval={0} // Show all ticks but hide most with the formatter
                  tickFormatter={(value) => {
                    if (!value) return '';
                    const parts = value.split(' ');
                    if (parts.length !== 2) return '';
                    
                    const month = parts[0];
                    const year = parts[1];
                    
                    // Only show Jan and Jul labels
                    if (month === 'Jan' || month === 'Jul') {
                      return `${month} ${year}`;
                    }
                    return ''; // Return empty string for other months to hide them
                  }}
                  height={60}
                  textAnchor="middle"
                />
              ) : (
                <XAxis 
                  dataKey={chartView === 'quarterly' ? 'YearQuarter' : 'Year'} 
                  tick={{ fontSize: 12 }}
                  angle={chartView === 'quarterly' ? -45 : 0}
                  textAnchor={chartView === 'quarterly' ? 'end' : 'middle'}
                  height={60}
                />
              )}
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              
              {/* Only render Actual and Fitted lines for points where they have actual values */}
              <Line 
                type="monotone" 
                dataKey={(dataPoint) => {
                  // Only show Fitted value if it exists and is greater than 0
                  return dataPoint.Fitted && dataPoint.Fitted > 0 ? dataPoint.Fitted : null;
                }}
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                name="Fitted"
              />
              
              <Line 
                type="monotone" 
                dataKey={(dataPoint) => {
                  // Only show Actual value if it exists and is greater than 0
                  return dataPoint.Actual && dataPoint.Actual > 0 ? dataPoint.Actual : null;
                }}
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                name="Actual"
              />
              
              {/* Only render Forecast line if showForecastLine is true */}
              {showForecastLine && (
                <Line 
                  type="monotone" 
                  dataKey={(dataPoint) => {
                    // Only show Forecast value if it exists and is greater than 0
                    return dataPoint.Forecast && dataPoint.Forecast > 0 ? dataPoint.Forecast : null;
                  }}
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  connectNulls={true}
                  activeDot={{ r: 6 }}
                  name="Forecast"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Filter information banner */}
      {isFilterActive && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Showing filtered data for: 
            <strong className="ml-2">
              {selectedMonth === 'All' ? 'All Months' : selectedMonth}
              {selectedMonth !== 'All' && selectedYear !== 'All' ? ', ' : ' '}
              {selectedYear === 'All' ? 'All Years' : selectedYear}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForecastChart;
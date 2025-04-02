'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUp, ArrowDown, Search, Filter, RefreshCw, ChevronDown, SortAsc, Calendar
} from 'lucide-react';

export default function TopPerformingSKUs({
  data = [],
  selectedProduct = 'All',
  selectedSKU = 'All',
  selectedDepot = 'All',
  selectedMonth = 'All',  // New prop for month filtering
  selectedYear = 'All',   // New prop for year filtering
  loading = false
}) {
  const [topSKUs, setTopSKUs] = useState([]);
  const [sortField, setSortField] = useState('actual');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasValidData, setHasValidData] = useState(true); // New state to track if data contains valid values

  // Helper function to get month name from date string
  const getMonthName = (dateString) => {
    if (!dateString) return '';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const parts = dateString.split('-');
    if (parts.length !== 3) return '';
    const monthIndex = parseInt(parts[0]) - 1; // Adjust for 0-based index
    return months[monthIndex];
  };

  // Helper function to extract year from date string
  const getYear = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return '';
    return parts[2];
  };

  // Process data when selection changes
  useEffect(() => {
    if (!data.length) {
      setHasValidData(false);
      return;
    }
    
    setIsCalculating(true);
    
    // Filter data based on selections
    let filteredData = [...data];
    
    if (selectedProduct && selectedProduct !== 'All') {
      filteredData = filteredData.filter(item => item.product === selectedProduct);
    }
    
    if (selectedSKU && selectedSKU !== 'All') {
      filteredData = filteredData.filter(item => item.SKU === selectedSKU);
    }
    
    if (selectedDepot && selectedDepot !== 'All') {
      filteredData = filteredData.filter(item => item.Depot === selectedDepot);
    }
    
    // Apply month filter - NEW
    if (selectedMonth && selectedMonth !== 'All') {
      filteredData = filteredData.filter(item => getMonthName(item.Month) === selectedMonth);
    }
    
    // Apply year filter - NEW
    if (selectedYear && selectedYear !== 'All') {
      filteredData = filteredData.filter(item => getYear(item.Month) === selectedYear.toString());
    }

    // Check if filtered data has any non-zero values
    const hasNonZeroData = filteredData.some(item => 
      Number(item.Actual || 0) > 0 || 
      Number(item.Fitted || 0) > 0 || 
      Number(item.Forecast || 0) > 0
    );

    // If there's no meaningful data, update state and exit early
    if (!hasNonZeroData || filteredData.length === 0) {
      setTimeout(() => {
        setHasValidData(false);
        setTopSKUs([]);
        setIsCalculating(false);
      }, 500);
      return;
    }

    // Aggregate by SKU
    const skuPerformance = filteredData.reduce((acc, item) => {
      const sku = item.SKU;
      if (!sku) return acc;
      
      if (!acc[sku]) {
        acc[sku] = {
          sku: sku,
          product: item.product,
          actual: 0,
          fitted: 0,
          forecast: 0,
          accuracy: 0,
          depots: new Set(),
        };
      }
      
      acc[sku].actual += Number(item.Actual || 0);
      acc[sku].fitted += Number(item.Fitted || 0);
      acc[sku].forecast += Number(item.Forecast || 0);
      acc[sku].depots.add(item.Depot || 'Unknown');
      
      return acc;
    }, {});

    // Filter out SKUs with zero actual, fitted, and accuracy values
    Object.keys(skuPerformance).forEach(key => {
      const sku = skuPerformance[key];
      // If actual AND fitted are both zero, remove the SKU from consideration
      if (sku.actual === 0 && sku.fitted === 0) {
        delete skuPerformance[key];
      }
    });

    // Check if any SKU has non-zero values after aggregation
    const hasValidAggregatedData = Object.values(skuPerformance).length > 0;

    if (!hasValidAggregatedData) {
      setTimeout(() => {
        setHasValidData(false);
        setTopSKUs([]);
        setIsCalculating(false);
      }, 500);
      return;
    }

    // Calculate accuracy and format for display
    const skuArray = Object.values(skuPerformance).map(sku => {
      // Calculate accuracy (difference between actual and fitted as percentage)
      const accuracy = sku.fitted !== 0 
        ? Math.round((1 - Math.abs(sku.actual - sku.fitted) / sku.fitted) * 100) 
        : 0;
      
      return {
        ...sku,
        accuracy,
        variance: sku.actual - sku.fitted,
        variancePercent: sku.fitted !== 0 
          ? Math.round((sku.actual - sku.fitted) / sku.fitted * 100) 
          : 0,
        depotsCount: sku.depots.size,
        depots: Array.from(sku.depots).join(', ')
      };
    });

    // Filter out SKUs where accuracy is 0
    const filteredSkuArray = skuArray.filter(sku => 
      // Only keep SKUs where at least actual OR fitted has a value, AND if both have values, accuracy isn't 0
      (sku.actual > 0 || sku.fitted > 0) && !(sku.actual > 0 && sku.fitted > 0 && sku.accuracy === 0)
    );

    // Apply search filter if any
    let searchResults = filteredSkuArray;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      searchResults = filteredSkuArray.filter(item => 
        item.sku.toLowerCase().includes(query) || 
        item.product.toLowerCase().includes(query) ||
        item.depots.toLowerCase().includes(query) 
      );
    }

    // Check if search returned any results
    if (searchResults.length === 0) {
      setTimeout(() => {
        setHasValidData(false);
        setTopSKUs([]);
        setIsCalculating(false);
      }, 500);
      return;
    }

    // FIRST sort by actual values to get the true top performers
    const topPerformers = [...searchResults].sort((a, b) => b.actual - a.actual).slice(0, 10);
    
    // THEN apply user-selected sorting to these top performers
    const sortedResults = [...topPerformers].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      
      if (sortField === 'accuracy' || sortField === 'variancePercent') {
        return multiplier * (a[sortField] - b[sortField]);
      }
      
      if (sortField === 'product' || sortField === 'sku' || sortField === 'depots') {
        return multiplier * a[sortField].localeCompare(b[sortField]);
      }
      
      return multiplier * (a[sortField] - b[sortField]);
    });
    
    setTimeout(() => {
      setHasValidData(true);
      setTopSKUs(sortedResults);
      setIsCalculating(false);
    }, 500); // Small delay to show loading state
  }, [data, selectedProduct, selectedSKU, selectedDepot, selectedMonth, selectedYear, sortField, sortDirection, searchQuery]);

  // Helper to toggle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for new field
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Top Performing SKUs
            {(selectedProduct !== 'All' || selectedSKU !== 'All' || selectedDepot !== 'All' || selectedMonth !== 'All' || selectedYear !== 'All') && (
              <span className="text-sm font-normal text-blue-600 ml-2">(Filtered)</span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Showing top 10 SKUs based on actual sales volume</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full md:w-56 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || isCalculating}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('sku')}>
                <div className="flex items-center">
                  SKU
                  {getSortIcon('sku')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('product')}>
                <div className="flex items-center">
                  Product
                  {getSortIcon('product')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('actual')}>
                <div className="flex items-center">
                  Actual
                  {getSortIcon('actual')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('fitted')}>
                <div className="flex items-center">
                  Fitted
                  {getSortIcon('fitted')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('accuracy')}>
                <div className="flex items-center">
                  Accuracy
                  {getSortIcon('accuracy')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('depotsCount')}>
                <div className="flex items-center">
                  Depots
                  {getSortIcon('depotsCount')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading || isCalculating ? (
              Array(5).fill(0).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                  </td>
                </tr>
              ))
            ) : !hasValidData ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                      <RefreshCw className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No data available</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {searchQuery ? 
                        "No results match your search criteria" : 
                        "No valid SKU data found for the selected filters"}
                    </p>
                    <p className="text-gray-400 text-xs mt-3">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                </td>
              </tr>
            ) : topSKUs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No SKUs found with valid performance data
                </td>
              </tr>
            ) : (
              topSKUs.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    {item.actual.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.fitted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        item.accuracy >= 90 ? 'text-green-600' :
                        item.accuracy >= 80 ? 'text-blue-600' :
                        item.accuracy >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {item.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                      {item.depotsCount}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 hidden md:inline">
                      {item.depots.length > 20 ? item.depots.substring(0, 20) + '...' : item.depots}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Applied filters information - Updated to include month and year */}
      {(selectedProduct !== 'All' || selectedSKU !== 'All' || selectedDepot !== 'All' || selectedMonth !== 'All' || selectedYear !== 'All') && !loading && !isCalculating && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Showing top SKUs filtered by: 
            <strong className="ml-2">
              {selectedProduct !== 'All' && <span>Product: {selectedProduct}</span>}
              {selectedProduct !== 'All' && (selectedSKU !== 'All' || selectedDepot !== 'All' || selectedMonth !== 'All' || selectedYear !== 'All') && <span> • </span>}
              
              {selectedSKU !== 'All' && <span>SKU: {selectedSKU}</span>}
              {selectedSKU !== 'All' && (selectedDepot !== 'All' || selectedMonth !== 'All' || selectedYear !== 'All') && <span> • </span>}
              
              {selectedDepot !== 'All' && <span>Depot: {selectedDepot}</span>}
              {selectedDepot !== 'All' && (selectedMonth !== 'All' || selectedYear !== 'All') && <span> • </span>}
              
              {selectedMonth !== 'All' && <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{selectedMonth}</span>}
              {selectedMonth !== 'All' && selectedYear !== 'All' && <span> • </span>}
              
              {selectedYear !== 'All' && <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{selectedYear}</span>}
            </strong>
          </p>
        </div>
      )}
      
      {/* Search info */}
      {searchQuery && !loading && !isCalculating && hasValidData && (
        <div className="mt-2 text-sm text-gray-500">
          Showing results for search: "{searchQuery}"
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../sidenavbar';
import Navbar from '../navbar';
import { IndianRupee } from "lucide-react";
import Papa from 'papaparse';
import FilterSection from './FilterSection';
import StatsCard from './StatsCard';
import CustomerBarChart from './CustomerBarChart';
import MonthlyBarChart from './MonthlyBarChart';
import ProductPieChart from './ProductPieChart';
import DropdownFilters from '../dashboard/dropdownfiter';
import TopPerformingSKUs from '../dashboard/topperforming';

export default function LifecyclePage() {
  // State for CSV data
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [products, setProducts] = useState([]);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState(null);

  // State for selected customers, active product, financial year and loading
  const [selectedCustomers, setSelectedCustomers] = useState(["All Customers"]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [barData, setBarData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [prevYearSales, setPrevYearSales] = useState(0);
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [animateCharts, setAnimateCharts] = useState(false);

  // State for forecast data (for DropdownFilters and TopPerformingSKUs)
  const [forecastData, setForecastData] = useState([]);
  const [forecastProducts, setForecastProducts] = useState(['All']);
  const [forecastSKUs, setForecastSKUs] = useState(['All']);
  const [forecastDepots, setForecastDepots] = useState(['All']);
  const [forecastLoading, setForecastLoading] = useState(false);
  
  // Selected filters for forecast data
  const [selectedForecastFilters, setSelectedForecastFilters] = useState({
    product: 'All',
    sku: 'All',
    depot: 'All',
    month: 'All',
    year: 'All'
  });

  // Load CSV data for lifecycle analytics
  useEffect(() => {
    const loadLifecycleData = async () => {
      setCsvLoading(true);
      setCsvError(null);
      
      try {
        const response = await fetch('/Anonymized_Lifecycle.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch CSV file');
        }
        
        const text = await response.text();
        Papa.parse(text, {
          complete: (result) => {
            if (result.data.length > 0) {
              setData(result.data);
              
              // Extract unique customers, financial years, and products
              const customerNames = ["All Customers", ...new Set(result.data.map(row => row.Customer))];
              const years = ["All Years", ...new Set(result.data.map(row => row['Financial Year']))];
              const productList = [...new Set(result.data.map(row => row.Product))];
              
              setCustomers(customerNames);
              setFinancialYears(years);
              setProducts(productList);
              
              // Set default financial year to "All Years"
              setSelectedFinancialYear("All Years");
              
              setCsvLoaded(true);
            }
            setCsvLoading(false);
          },
          header: true,
          skipEmptyLines: true,
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setCsvError(error.message);
        setCsvLoading(false);
      }
    };
    
    loadLifecycleData();
    // Load forecast data separately
    loadForecastData();
  }, []);

  // Load forecast data from a separate CSV - isolated function
  const loadForecastData = useCallback(() => {
    setForecastLoading(true);
    
    fetch('/Anonymized_LightingWireFiana1.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        return response.text();
      })
      .then((text) => {
        Papa.parse(text, {
          complete: (result) => {
            if (result.data && result.data.length > 0) {
              const forecastDataArray = result.data.filter(row => 
                // Filter out rows with missing essential data
                row && row.product && row.SKU && row.Depot
              );
              
              setForecastData(forecastDataArray);
              
              // Extract unique products, SKUs, and depots for filters
              const products = ['All', ...new Set(forecastDataArray.map(row => row.product))];
              setForecastProducts(products);
              
              // Initial SKUs and depots
              const skus = ['All', ...new Set(forecastDataArray.map(row => row.SKU))];
              const depots = ['All', ...new Set(forecastDataArray.map(row => row.Depot))];
              
              setForecastSKUs(skus);
              setForecastDepots(depots);
            }
            setForecastLoading(false);
          },
          header: true,
          skipEmptyLines: true,
        });
      })
      .catch((error) => {
        console.error('Error loading forecast data:', error);
        setForecastLoading(false);
      });
  }, []);

  // Process data for charts when selections change
  useEffect(() => {
    if (!csvLoaded || selectedFinancialYear === '') return;

    // Simulate loading
    setLoading(true);
    setAnimateCharts(false);
    
    const timer = setTimeout(() => {
      // Update the charts based on selected customers, financial year and active product
      updateCharts(selectedCustomers, selectedFinancialYear, activeProduct);
      setLoading(false);
      
      // Trigger animations after data is loaded
      setTimeout(() => {
        setAnimateCharts(true);
      }, 100);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [selectedCustomers, selectedFinancialYear, activeProduct, csvLoaded]);

  // Handle forecast filter changes - improved to avoid unnecessary updates
  const handleForecastFilterChange = useCallback((filters) => {
    // Avoid unnecessary state updates if values haven't changed
    if (JSON.stringify(filters) === JSON.stringify(selectedForecastFilters)) {
      return;
    }
    
    setForecastLoading(true);
    
    // Update SKUs and depots based on product selection
    const updateFilteredLists = () => {
      // Only update if product filter changed
      if (filters.product !== selectedForecastFilters.product) {
        let filteredSKUs = ['All'];
        if (filters.product !== 'All') {
          filteredSKUs = ['All', ...new Set(forecastData
            .filter(item => item.product === filters.product)
            .map(item => item.SKU))];
        } else {
          filteredSKUs = ['All', ...new Set(forecastData.map(item => item.SKU))];
        }
        
        // Set the SKUs first
        setForecastSKUs(filteredSKUs);
        
        // Reset SKU selection if not in filtered list
        if (!filteredSKUs.includes(filters.sku)) {
          filters.sku = 'All';
        }
      }
      
      // Update depots based on product and SKU selection
      let filteredDepots = ['All'];
      
      if (filters.product !== 'All' && filters.sku !== 'All') {
        filteredDepots = ['All', ...new Set(forecastData
          .filter(item => item.product === filters.product && item.SKU === filters.sku)
          .map(item => item.Depot))];
      } else if (filters.product !== 'All') {
        filteredDepots = ['All', ...new Set(forecastData
          .filter(item => item.product === filters.product)
          .map(item => item.Depot))];
      } else if (filters.sku !== 'All') {
        filteredDepots = ['All', ...new Set(forecastData
          .filter(item => item.SKU === filters.sku)
          .map(item => item.Depot))];
      } else {
        filteredDepots = ['All', ...new Set(forecastData.map(item => item.Depot))];
      }
      
      setForecastDepots(filteredDepots);
      
      // Update filters after lists are updated
      setSelectedForecastFilters(filters);
      setForecastLoading(false);
    };
    
    // Use setTimeout to ensure state updates don't clash
    setTimeout(updateFilteredLists, 100);
  }, [forecastData, selectedForecastFilters]);

  const calculateTotalSales = useCallback((customers, financialYear, activeProduct) => {
    if (!csvLoaded || data.length === 0) return 0;
    
    let filteredData = [...data];
    
    // Filter by financial year if not "All Years"
    if (financialYear !== "All Years") {
      filteredData = filteredData.filter(row => row['Financial Year'] === financialYear);
    }
    
    // Filter by customer if not "All Customers"
    if (!customers.includes("All Customers")) {
      filteredData = filteredData.filter(row => customers.includes(row.Customer));
    }
    
    // Filter by product if selected
    if (activeProduct) {
      filteredData = filteredData.filter(row => row.Product === activeProduct);
    }
    
    // Sum all sales
    return filteredData.reduce((sum, row) => {
      const sales = parseFloat(row.Sales || 0);
      return sum + (isNaN(sales) ? 0 : sales);
    }, 0);
  }, [csvLoaded, data]);

  const updateCharts = useCallback((customers, financialYear, activeProduct) => {
    if (!csvLoaded || data.length === 0) return;
    
    // Calculate total sales based on selection
    const calculatedTotalSales = calculateTotalSales(customers, financialYear, activeProduct);
    setTotalSales(calculatedTotalSales);
    
    // Calculate previous year's sales for comparison if possible
    if (financialYear !== "All Years") {
      const currentYearIndex = financialYears.indexOf(financialYear);
      if (currentYearIndex > 1) { // Index > 1 because index 0 is "All Years"
        const prevYear = financialYears[currentYearIndex - 1];
        if (prevYear !== "All Years") {
          const prevYearSalesValue = calculateTotalSales(customers, prevYear, activeProduct);
          setPrevYearSales(prevYearSalesValue);
          
          // Calculate growth percentage
          if (prevYearSalesValue > 0) {
            const growth = ((calculatedTotalSales - prevYearSalesValue) / prevYearSalesValue) * 100;
            setSalesGrowth(growth);
          } else {
            setSalesGrowth(0);
          }
        } else {
          setPrevYearSales(0);
          setSalesGrowth(0);
        }
      } else {
        setPrevYearSales(0);
        setSalesGrowth(0);
      }
    } else {
      setPrevYearSales(0);
      setSalesGrowth(0);
    }
    
    let filteredData = [...data];
    
    // Filter by financial year if not "All Years"
    if (financialYear !== "All Years") {
      filteredData = filteredData.filter(row => row['Financial Year'] === financialYear);
    }
    
    // Filter by customer if not "All Customers"
    if (!customers.includes("All Customers")) {
      filteredData = filteredData.filter(row => customers.includes(row.Customer));
    }
    
    // Filter by product if selected
    if (activeProduct) {
      filteredData = filteredData.filter(row => row.Product === activeProduct);
    }
    
    // Create bar chart data - sales by customer
    const customerSalesMap = {};
    filteredData.forEach(row => {
      const customer = row.Customer;
      const sales = parseFloat(row.Sales || 0);
      if (!isNaN(sales)) {
        customerSalesMap[customer] = (customerSalesMap[customer] || 0) + sales;
      }
    });
    
    const barChartData = Object.entries(customerSalesMap).map(([name, sales]) => ({
      name,
      sales
    }));
    
    // Create monthly sales data
    const monthlySalesMap = {};
    filteredData.forEach(row => {
      const month = row.Month;
      const sales = parseFloat(row.Sales || 0);
      if (!isNaN(sales) && month) {
        monthlySalesMap[month] = (monthlySalesMap[month] || 0) + sales;
      }
    });
    
    // Sort months in correct financial year order
    const monthOrder = {
      "April": 1, "May": 2, "June": 3, "July": 4, "August": 5, "September": 6,
      "October": 7, "November": 8, "December": 9, "January": 10, "February": 11, "March": 12
    };
    
    const monthlyBarData = Object.entries(monthlySalesMap)
      .map(([month, sales]) => ({ month, sales }))
      .sort((a, b) => (monthOrder[a.month] || 13) - (monthOrder[b.month] || 13));
    
    // Create pie chart data - sales by product
    const productSalesMap = {};
    filteredData.forEach(row => {
      const product = row.Product;
      const sales = parseFloat(row.Sales || 0);
      if (!isNaN(sales) && product) {
        productSalesMap[product] = (productSalesMap[product] || 0) + sales;
      }
    });
    
    const pieChartData = Object.entries(productSalesMap)
      .map(([product, sales]) => ({
        product,
        sales,
        percentage: (sales / calculatedTotalSales * 100).toFixed(1)
      }))
      .sort((a, b) => b.sales - a.sales); // Sort by sales value for better display
    
    setBarData(barChartData);
    setMonthlyData(monthlyBarData);
    setPieData(pieChartData);
  }, [csvLoaded, data, calculateTotalSales, financialYears]);

  // Handle customer selection
  const handleCustomerToggle = useCallback((customer) => {
    setSelectedCustomers(prev => {
      if (customer === "All Customers") {
        return ["All Customers"];
      } else {
        // Remove "All Customers" when specific customers are selected
        const newSelection = prev.filter(c => c !== "All Customers");
        
        if (newSelection.includes(customer)) {
          const result = newSelection.filter(c => c !== customer);
          return result.length === 0 ? ["All Customers"] : result;
        } else {
          return [...newSelection, customer];
        }
      }
    });
  }, []);

  // Handle financial year selection
  const handleFinancialYearSelect = useCallback((year) => {
    setSelectedFinancialYear(year);
  }, []);

  // Handle pie chart segment click
  const handlePieClick = useCallback((product) => {
    if (activeProduct === product) {
      setActiveProduct(null); // Deselect if already selected
    } else {
      setActiveProduct(product);
    }
  }, [activeProduct]);

  return (
    <div className="flex h-screen">
      {/* Sidebar takes a fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="p-4 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #024673 0%, #5C99E3 50%, #756CE5 100%)' }}>
          <div className="shadow-sm rounded-lg p-6 mb-6 transition-all duration-500 ease-in-out" style={{ background: 'linear-gradient(135deg, #024673 0%, #5C99E3 50%, #756CE5 100%)' }}>
            <h1 className="text-2xl font-bold text-white mb-4">Lifecycle of Clients</h1>
            <p className="text-white mb-4">
              View and analyze sales data for all your customers. Use the filters below to customize your view.
            </p>
            
            {/* CSV Loading Status */}
            {csvLoading && (
              <div className="mb-6 flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-100 border-t-blue-600 mr-3"></div>
                <p>Loading CSV data...</p>
              </div>
            )}
            
            {csvError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                <p>Error loading CSV: {csvError}</p>
              </div>
            )}
            
            {csvLoaded && (
              <>
                {/* Filters Section */}
                <FilterSection 
                  customers={customers}
                  financialYears={financialYears}
                  selectedCustomers={selectedCustomers}
                  selectedFinancialYear={selectedFinancialYear}
                  handleCustomerToggle={handleCustomerToggle}
                  handleFinancialYearSelect={handleFinancialYearSelect}
                />
                
                {/* Total Sales Card */}
                {selectedFinancialYear && (
                  <StatsCard 
                    totalSales={totalSales}
                    activeProduct={activeProduct}
                    selectedFinancialYear={selectedFinancialYear}
                    selectedCustomers={selectedCustomers}
                    animateCharts={animateCharts}
                  />
                )}
                
                {/* Active Filters Display */}
                {activeProduct && (
                  <div className="mb-6 animate-fadeIn">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Active Filter:</span>
                      <span 
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex items-center cursor-pointer transition-all duration-300 hover:bg-blue-200"
                        onClick={() => setActiveProduct(null)}
                      >
                        {activeProduct} <span className="ml-1 transition-transform duration-300 hover:scale-125">×</span>
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 transition-all duration-500"></div>
                  </div>
                )}
                
                {/* Charts Container */}
                {!loading && selectedFinancialYear && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart - Total Sales by Customer */}
                    <CustomerBarChart 
                      barData={barData} 
                      animateCharts={animateCharts} 
                    />
                    
                    {/* Bar Chart - Monthly Sales Trend */}
                    <MonthlyBarChart 
                      monthlyData={monthlyData} 
                      animateCharts={animateCharts} 
                    />
                    
                    {/* Pie Chart - Sales by Product */}
                    <ProductPieChart 
                      pieData={pieData} 
                      animateCharts={animateCharts} 
                      activeProduct={activeProduct}
                      handlePieClick={handlePieClick}
                    />
                  </div>
                )}
                
                {/* Forecast Section */}
                <div className="mt-8 pt-8 border-t border-blue-300">
                  <h2 className="text-xl font-bold text-white mb-4">Forecast Analysis</h2>
                  <p className="text-white mb-6">
                    View and analyze sales forecasts by product, SKU, and depot. Use the filters below to customize your view.
                  </p>
                  
                  {/* DropdownFilters Component */}
                  <DropdownFilters
                    onFilterChange={handleForecastFilterChange}
                    products={forecastProducts}
                    skus={forecastSKUs}
                    depots={forecastDepots}
                    loading={forecastLoading}
                    selectedProduct={selectedForecastFilters.product}
                    selectedSKU={selectedForecastFilters.sku}
                    selectedDepot={selectedForecastFilters.depot}
                    selectedMonth={selectedForecastFilters.month}
                    selectedYear={selectedForecastFilters.year}
                  />
                  
                  {/* TopPerformingSKUs Component */}
                  {!forecastLoading && (
                    <TopPerformingSKUs
                      data={forecastData}
                      selectedProduct={selectedForecastFilters.product}
                      selectedSKU={selectedForecastFilters.sku}
                      selectedDepot={selectedForecastFilters.depot}
                      selectedMonth={selectedForecastFilters.month}
                      selectedYear={selectedForecastFilters.year}
                      loading={forecastLoading}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
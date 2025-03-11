'use client';

import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import Sidebar from "./components/sidenavbar";
import Navbar from "./components/navbar";
import Hero from './components/Hero';
import DropdownFilters from './components/dropdownfiter';
import ForecastMetrics from './components/forecastmetrics';
import ForecastChart from './components/ForecastChart';

export default function Home() {
  // Data states from trial.jsx
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [skus, setSkus] = useState([]);
  const [depots, setDepots] = useState([]);
  
  // Filter states
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSKU, setSelectedSKU] = useState('');
  const [selectedDepot, setSelectedDepot] = useState('');
  
  // Analytics states
  const [totalForecast, setTotalForecast] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartDataQuarterly, setChartDataQuarterly] = useState([]);
  
  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch CSV data on component mount
  useEffect(() => {
    fetch('/LightingWireFiana.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setData(result.data);
            const uniqueProducts = [...new Set(result.data.map(item => item.product))];
            setProducts(['All', ...uniqueProducts]);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
        setLoading(false);
      });
  }, []);

  // Update SKUs when product selection changes
  useEffect(() => {
    if (selectedProduct && selectedProduct !== 'All') {
      const filteredSKUs = [...new Set(data.filter(item => item.product === selectedProduct).map(item => item.SKU))];
      setSkus(['All', ...filteredSKUs]);
      setSelectedSKU('All');
    } else if (selectedProduct === 'All') {
      const allSkus = [...new Set(data.map(item => item.SKU))];
      setSkus(['All', ...allSkus]);
      setSelectedSKU('All');
    }
  }, [selectedProduct, data]);

  // Update depots when SKU selection changes
  useEffect(() => {
    if (selectedSKU && selectedSKU !== 'All') {
      const filteredDepots = [...new Set(data.filter(item => item.SKU === selectedSKU).map(item => item.Depot))];
      setDepots(['All', ...filteredDepots]);
      setSelectedDepot('All');
    } else if (selectedSKU === 'All') {
      const allDepots = [...new Set(data.map(item => item.Depot))];
      setDepots(['All', ...allDepots]);
      setSelectedDepot('All');
    }
  }, [selectedSKU, data]);

  // Process data when selection changes
  useEffect(() => {
    if (!data.length) return;
    
    setLoading(true);
    
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

    // Calculate total forecast and average accuracy
    const totalForecastValue = filteredData.reduce((sum, item) => sum + Number(item.Forecast || 0), 0);
    const totalAccuracyValue = filteredData.reduce((sum, item) => {
      const accuracy = parseFloat(item.Accuracy?.replace('%', '')) || 0;
      return sum + accuracy;
    }, 0);
    const avgAccuracyValue = filteredData.length > 0 ? (totalAccuracyValue / filteredData.length).toFixed(2) : 0;

    setTotalForecast(totalForecastValue);
    setAverageAccuracy(avgAccuracyValue);

    // Group data by year for yearly chart
    const yearlyData = filteredData.reduce((acc, item) => {
      if (!item.Month) return acc;
      
      const year = item.Month.split('-')[2]; // Extract year from date format "04-01-2021"
      if (!year) return acc;
      
      if (!acc[year]) {
        acc[year] = { Year: year, Forecast: 0, Actual: 0 };
      }
      acc[year].Forecast += Number(item.Forecast || 0);
      acc[year].Actual += Number(item.Actual || 0);
      return acc;
    }, {});

    // Group data by quarter for quarterly chart
    const quarterlyData = filteredData.reduce((acc, item) => {
      if (!item.Month) return acc;
      
      const parts = item.Month.split('-');
      if (parts.length !== 3) return acc;
      
      const month = parseInt(parts[0]);
      const year = parts[2];
      
      // Determine quarter
      let quarter;
      if (month >= 1 && month <= 3) quarter = 'Q1';
      else if (month >= 4 && month <= 6) quarter = 'Q2';
      else if (month >= 7 && month <= 9) quarter = 'Q3';
      else quarter = 'Q4';
      
      const yearQuarter = `${year}-${quarter}`;
      
      if (!acc[yearQuarter]) {
        acc[yearQuarter] = { YearQuarter: yearQuarter, Forecast: 0, Actual: 0 };
      }
      
      acc[yearQuarter].Forecast += Number(item.Forecast || 0);
      acc[yearQuarter].Actual += Number(item.Actual || 0);
      
      return acc;
    }, {});

    // Convert objects to arrays and sort
    const formattedYearlyData = Object.values(yearlyData).sort((a, b) => a.Year.localeCompare(b.Year));
    const formattedQuarterlyData = Object.values(quarterlyData).sort((a, b) => a.YearQuarter.localeCompare(b.YearQuarter));
    
    setChartData(formattedYearlyData);
    setChartDataQuarterly(formattedQuarterlyData);
    
    setTimeout(() => {
      setLoading(false);
    }, 600); // Add slight delay to show loading animations
  }, [selectedProduct, selectedSKU, selectedDepot, data]);

  // Handle filter changes from the dropdown component
  const handleFilterChange = useCallback((newFilters) => {
    setSelectedProduct(newFilters.product);
    setSelectedSKU(newFilters.sku);
    setSelectedDepot(newFilters.depot);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar takes a fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="p-4 bg-gray-50 overflow-y-auto"> 
          {/* Hero Section */}
          <Hero />
          
          {/* Filter Section */}
          <div className="mt-6">
            <DropdownFilters 
              onFilterChange={handleFilterChange}
              products={products}
              skus={skus}
              depots={depots}
              loading={loading}
              selectedProduct={selectedProduct}
              selectedSKU={selectedSKU}
              selectedDepot={selectedDepot}
            />
          </div>
          
          {/* Metrics Section */}
          <div className="mt-4">
            <ForecastMetrics 
              isLoading={loading}
              totalForecast={totalForecast}
              accuracyRate={averageAccuracy}
            />
          </div>
          
          {/* Chart Section */}
          <div className="mt-4">
            <ForecastChart 
              isLoading={loading}
              yearlyData={chartData}
              quarterlyData={chartDataQuarterly}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
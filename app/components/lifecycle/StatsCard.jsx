import { IndianRupee } from "lucide-react";

const StatsCard = ({
  totalSales,
  activeProduct,
  selectedFinancialYear,
  selectedCustomers,
  animateCharts
}) => {
  return (
    <div className={`bg-gradient-to-br from-[#024673] to-[#5C99E3] border border-blue-200 rounded-lg shadow-sm p-6 mb-6 transition-all duration-500 ease-in-out transform ${animateCharts ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <IndianRupee className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Total Sales {activeProduct ? `(${activeProduct})` : ''} - {selectedFinancialYear}
          </h3>
          <p className="text-3xl font-bold text-white mt-1">
            ₹{totalSales.toLocaleString()}
          </p>
          <p className="text-sm text-white mt-1">
            {selectedCustomers.includes("All Customers") 
              ? "All Customers" 
              : selectedCustomers.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
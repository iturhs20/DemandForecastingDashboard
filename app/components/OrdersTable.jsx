import React from "react";

const OrdersTable = ({ 
  showOrdersTable,
  selectedRange,
  aggregatedData,
  selectedOrder,
  orderDetails,
  data,
  colors,
  closeOrdersTable,
  closeDetails,
  handleOrderClick
}) => {
  if (!showOrdersTable && !selectedOrder) return null;

  return (
    <>
      {/* Orders Table Modal */}
      {showOrdersTable && (
        <div className="fixed inset-0 bg-slate-700/40 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-6 max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Orders with Fulfillment Ratio {selectedRange.label}
              </h2>
              <button 
                onClick={closeOrdersTable}
                className="bg-slate-200 hover:bg-slate-300 rounded-full p-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {aggregatedData.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
                <p>No orders found in this fulfillment ratio range.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-sm shadow-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-300 p-3 text-left font-semibold">Order</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Required Qty</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Fulfilled Qty</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Pending Qty</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">SKU Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedData.map((item, idx) => {
                      // Count the number of SKUs for this order in the filtered data
                      const skuCount = data.filter(
                        d => d.order === item.order && 
                             d.ratio >= selectedRange.min && 
                             d.ratio <= selectedRange.max
                      ).length;
                      
                      return (
                        <tr 
                          key={idx} 
                          className="hover:bg-blue-50 cursor-pointer border-b border-slate-200"
                          onClick={() => handleOrderClick(item.order)}
                        >
                          <td className="p-3 text-slate-800">{item.order}</td>
                          <td className="p-3 text-right text-slate-800">{item.required.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-800">{item.fulfilled.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-800">{item.pending.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-800">{skuCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Details Modal - On top of Orders Table */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-700/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-6 max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Order Details: {selectedOrder} 
                <span className="text-sm font-normal ml-2 text-slate-600">
                  (Fulfillment Ratio: {selectedRange.label})
                </span>
              </h2>
              <button 
                onClick={closeDetails}
                className="bg-slate-200 hover:bg-slate-300 rounded-full p-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {orderDetails.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
                <p>No details found for this order.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-sm shadow-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-300 p-3 text-left font-semibold">Order</th>
                      <th className="border border-slate-300 p-3 text-left font-semibold">SKU</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Required Qty</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Fulfilled Qty</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Pending Qty</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Short Sales</th>
                      <th className="border border-slate-300 p-3 text-right font-semibold">Fulfillment %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="p-3 text-slate-800">{item.order}</td>
                        <td className="p-3 text-slate-800">{item.sku}</td>
                        <td className="p-3 text-right text-slate-800">{item.required.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-800">{item.fulfilled.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-800">{item.pending.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-800">{item.shortSales.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-800 font-medium">{item.ratio}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
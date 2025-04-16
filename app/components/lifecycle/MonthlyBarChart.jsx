import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyBarChart = ({ monthlyData, animateCharts }) => {
  // Format large numbers to use L (Lakh) or M (Million) notation
  const formatYAxis = (value) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  return (
    <div className={`bg-gradient-to-br from-[#024673] to-[#5C99E3] p-4 rounded-lg border border-blue-200 shadow-sm transition-all duration-500 ease-in-out transform ${animateCharts ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
      <h2 className="font-semibold text-white mb-4">Monthly Sales Trend</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="white"/>
            <YAxis tickFormatter={formatYAxis} stroke="white"/>
            <Tooltip 
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{ 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              animationDuration={300}
            />
            <Legend wrapperStyle={{ transition: 'all 0.3s ease' }} />
            <Bar 
              dataKey="sales" 
              name="Monthly Sales (₹)" 
              fill="#00C49F"
              stroke="white" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
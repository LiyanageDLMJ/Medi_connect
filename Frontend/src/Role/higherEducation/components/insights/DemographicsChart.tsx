import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type DemographicsChartProps = {
  dateRange: string;
};

const COLORS = ["#6366f1", "#10b981", "#f59e42", "#ef4444", "#3b82f6"];

const DemographicsChart: React.FC<DemographicsChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:3000/higherDegrees/insights/demographics")
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [dateRange]);

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-center" style={{ height: 380 }}>
      <h2 className="font-semibold mb-2">Student Demographics</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="gender" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DemographicsChart; 
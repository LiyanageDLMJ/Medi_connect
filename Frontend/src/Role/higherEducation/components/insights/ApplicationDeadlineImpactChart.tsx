import  { useEffect, useState } from "react";
import * as React from "react";


import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ApplicationDeadlineImpactChartProps = {
  courseType: string;
};

const COLORS = ["#3b82f6", "#f59e42", "#ef4444"];

const ApplicationDeadlineImpactChart: React.FC<ApplicationDeadlineImpactChartProps> = ({ courseType }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/higherDegrees/insights/application-rush-by-deadline?courseName=${encodeURIComponent(courseType || 'All')}`)
      .then(res => res.json())
      .then(json => Array.isArray(json) ? setData(json) : setData([]))
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [courseType]);

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-center" style={{ height: 380 }}>
      <h2 className="font-semibold mb-2 flex items-center gap-2">
        Application Rush Analysis
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : !Array.isArray(data) || data.length === 0 ? (
        <div className="text-gray-500">Select a course to see rush analysis.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
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

export default ApplicationDeadlineImpactChart; 
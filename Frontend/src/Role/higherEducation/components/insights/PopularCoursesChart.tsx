import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type PopularCoursesChartProps = {
  dateRange: string;
};

const PopularCoursesChart: React.FC<PopularCoursesChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:3000/higherDegrees/insights/popular-courses")
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [dateRange]);

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: 380 }}>
      <h2 className="font-semibold mb-2">Popular Courses</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applications" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PopularCoursesChart; 
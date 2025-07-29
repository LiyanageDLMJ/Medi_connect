import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type DemographicsChartProps = {
  dateRange: string;
  courseType?: string; // Add courseType prop
  applicantType?: string; // Add applicantType prop
};

const COLORS = ["#6366f1", "#10b981", "#f59e42", "#ef4444", "#3b82f6"];

const DemographicsChart: React.FC<DemographicsChartProps> = ({ dateRange, courseType = "All", applicantType = "All" }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Build query parameters for filtering
    const params = new URLSearchParams();
    if (courseType && courseType !== "All") {
      params.append('courseType', courseType);
    }
    if (applicantType && applicantType !== "All") {
      params.append('applicantType', applicantType);
    }
    if (dateRange) {
      params.append('dateRange', dateRange);
    }
    
    const url = `http://localhost:3000/higherDegrees/insights/demographics${params.toString() ? '?' + params.toString() : ''}`;
    
    fetch(url, { headers })
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [dateRange, courseType, applicantType]); // Add applicantType to dependency array

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: 400 }}>
      <h2 className="font-semibold mb-4">Student Demographics</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      ) : (
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                dataKey="count" 
                nameKey="gender" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label={({ gender, count }) => `${gender}: ${count}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DemographicsChart; 
import  { useEffect, useState } from "react";
import * as React from "react";


import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ApplicationDeadlineImpactChartProps = {
  courseType?: string;
  dateRange?: string;
  applicantType?: string; // Add applicantType prop
};

const COLORS = ["#3b82f6", "#f59e42", "#ef4444"];

const ApplicationDeadlineImpactChart: React.FC<ApplicationDeadlineImpactChartProps> = ({ courseType = "All", dateRange = "Last 30 days", applicantType = "All" }) => {
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
    
    const url = `http://localhost:3000/higherDegrees/insights/application-rush-by-deadline${params.toString() ? '?' + params.toString() : ''}`;
    
    // Debug: Log the filter parameters being sent
    console.log('=== DEBUG: Application Rush Analysis Frontend ===');
    console.log('Filter props received:', { courseType, dateRange, applicantType });
    console.log('Query parameters:', params.toString());
    console.log('Full URL:', url);
    
    fetch(url, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('ApplicationDeadlineImpactChart - Data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error('ApplicationDeadlineImpactChart - Data is not an array:', data);
          setData([]);
          setError('Invalid data format received');
        }
      })
      .catch((error) => {
        console.error('ApplicationDeadlineImpactChart - Error:', error);
        setError("Failed to load data");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [courseType, dateRange, applicantType]); // Add applicantType to dependencies

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: 400 }}>
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        Application Rush Analysis
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      ) : !Array.isArray(data) || data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">Select a course to see rush analysis.</div>
      ) : (
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label={({ name, value }) => `${name}: ${value}`}
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

export default ApplicationDeadlineImpactChart; 
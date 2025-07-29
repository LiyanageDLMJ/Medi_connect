import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e42", "#ef4444"];

type ApplicantTypeBreakdownProps = {
  dateRange?: string;
  courseType?: string;
  applicantType?: string;
};

const ApplicantTypeBreakdown: React.FC<ApplicantTypeBreakdownProps> = ({ 
  dateRange = "Last 30 days", 
  courseType = "All", 
  applicantType = "All" 
}) => {
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
    if (dateRange) {
      params.append('dateRange', dateRange);
    }
    if (applicantType && applicantType !== "All") {
      params.append('applicantType', applicantType);
    }
    
    const url = `http://localhost:3000/higherDegrees/insights/applicant-type-breakdown${params.toString() ? '?' + params.toString() : ''}`;
    
    // Debug: Log the filter parameters being sent
    console.log('=== DEBUG: ApplicantTypeBreakdown Frontend ===');
    console.log('Filter props received:', { dateRange, courseType, applicantType });
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
        console.log('ApplicantTypeBreakdown - Data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error('ApplicantTypeBreakdown - Data is not an array:', data);
          setData([]);
          setError('Invalid data format received');
        }
      })
      .catch((error) => {
        console.error('ApplicantTypeBreakdown - Error:', error);
        setError("Failed to load data");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [dateRange, courseType, applicantType]); // Add dependencies

  // Format data for display - add safety check
  const formattedData = Array.isArray(data) ? data.map(item => ({
    name: item.type === 'MedicalStudent' ? 'Medical Students' : 
          item.type === 'Doctor' ? 'Doctors' : 
          item.type || 'Unknown',
    value: item.count
  })) : [];

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: 400 }}>
      <h2 className="font-semibold mb-4">Applicant Type Breakdown</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      ) : formattedData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">No applicant data available.</div>
      ) : (
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={formattedData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label={({ name, value }) => `${name}: ${value}`}
              >
                {formattedData.map((entry, index) => (
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

export default ApplicantTypeBreakdown; 
import  { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type PopularCoursesChartProps = {
  dateRange: string;
  applicantType?: string; // Add applicantType prop
};

const PopularCoursesChart: React.FC<PopularCoursesChartProps> = ({ dateRange, applicantType = "All" }) => {
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
    if (applicantType && applicantType !== "All") {
      params.append('applicantType', applicantType);
    }
    if (dateRange) {
      params.append('dateRange', dateRange);
    }
    
    const url = `http://localhost:3000/higherDegrees/insights/popular-courses${params.toString() ? '?' + params.toString() : ''}`;
    
    fetch(url, { headers })
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [dateRange, applicantType]); // Add applicantType to dependency array

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: 400 }}>
      <h2 className="font-semibold mb-4">Popular Courses</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      ) : (
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                angle={-15}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis 
                domain={[0, 'dataMax + 1']}
                tickFormatter={(value) => Math.round(value).toString()}
                allowDecimals={false}
              />
              <Tooltip />
              <Bar dataKey="applications" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PopularCoursesChart; 
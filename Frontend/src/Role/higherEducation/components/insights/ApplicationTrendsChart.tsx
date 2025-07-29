import  { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ApplicationTrendsChartProps = {
  dateRange: string;
  courseType?: string;
  applicantType?: string; // Add applicantType prop
};

const ApplicationTrendsChart: React.FC<ApplicationTrendsChartProps> = ({ dateRange, courseType = "All", applicantType = "All" }) => {
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
    
    const url = `http://localhost:3000/higherDegrees/insights/application-trends${params.toString() ? '?' + params.toString() : ''}`;
    
    fetch(url, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('ApplicationTrendsChart - Data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error('ApplicationTrendsChart - Data is not an array:', data);
          setData([]);
          setError('Invalid data format received');
        }
      })
      .catch((error) => {
        console.error('ApplicationTrendsChart - Error:', error);
        setError("Failed to load data");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [dateRange, courseType, applicantType]); // Add applicantType to dependencies

  // Determine which lines to show - add safety check
  const allCoursesSet = new Set<string>();
  if (Array.isArray(data)) {
    data.forEach(row => {
      if (row && typeof row === 'object') {
        Object.keys(row).forEach(k => {
          if (k !== "month") allCoursesSet.add(k);
        });
      }
    });
  }
  const allCourses = Array.from(allCoursesSet);
  let linesToShow: string[] = [];
  if (courseType === "All") {
    linesToShow = allCourses;
  } else {
    linesToShow = [courseType];
  }

  // Format month labels for display
  const formattedData = data.map(row => ({
    ...row,
    month: row.month ? new Date(row.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }) : row.month
  }));

  console.log("Chart data:", formattedData);

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-center" style={{ height: 380 }}>
      <h2 className="font-semibold mb-2">Application Trends</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <XAxis dataKey="month" angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis 
              domain={[0, 'dataMax + 1']}
              tickFormatter={(value) => Math.round(value).toString()}
              allowDecimals={false}
            />
            <Tooltip />
            {linesToShow.map((course, idx) => (
              <Line
                key={course}
                type="monotone"
                dataKey={course}
                stroke={["#3b82f6", "#10b981", "#f59e42", "#6366f1", "#ef4444"][idx % 5]}
                strokeWidth={3}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationTrendsChart; 
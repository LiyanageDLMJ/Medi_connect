import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ApplicationTrendsChartProps = {
  dateRange: string;
  courseType: string;
};

const ApplicationTrendsChart: React.FC<ApplicationTrendsChartProps> = ({ dateRange, courseType }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/higherDegrees/insights/application-trends?dateRange=${encodeURIComponent(dateRange)}&courseType=${encodeURIComponent(courseType)}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [dateRange, courseType]);

  // Determine which lines to show
  const allCoursesSet = new Set<string>();
  data.forEach(row => {
    Object.keys(row).forEach(k => {
      if (k !== "month") allCoursesSet.add(k);
    });
  });
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
            <YAxis />
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
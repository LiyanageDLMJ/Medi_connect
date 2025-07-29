import { useEffect, useState } from "react";

const COLORS = ["#3b82f6", "#fbbf24", "#10b981", "#ef4444"];

type EnrollmentFunnelChartProps = {
  dateRange: string;
  courseType?: string;
  applicantType?: string; // Add applicantType prop
};

const EnrollmentFunnelChart: React.FC<EnrollmentFunnelChartProps> = ({ dateRange, courseType = "All", applicantType = "All" }) => {
  const [funnelData, setFunnelData] = useState<any[]>([]);
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
    
    const url = `http://localhost:3000/higherDegrees/insights/enrollment-funnel${params.toString() ? '?' + params.toString() : ''}`;
    
    fetch(url, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('EnrollmentFunnelChart - Data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setFunnelData(data);
        } else {
          console.error('EnrollmentFunnelChart - Data is not an array:', data);
          setFunnelData([]);
          setError('Invalid data format received');
        }
      })
      .catch((error) => {
        console.error('EnrollmentFunnelChart - Error:', error);
        setError("Failed to load data");
        setFunnelData([]);
      })
      .finally(() => setLoading(false));
  }, [dateRange, courseType, applicantType]); // Add applicantType to dependencies

  // Add safety check for maxValue calculation
  const maxValue = Array.isArray(funnelData) && funnelData.length > 0 ? Math.max(...funnelData.map(d => d.value)) : 1;

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-center" style={{ height: 380 }}>
      <h2 className="font-semibold mb-2">Application Status Overview</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
      <div className="space-y-6 mt-6">
        {funnelData.map((stage, idx) => (
          <div key={`${stage.stage}-${idx}`} className="flex items-center gap-4">
            <span className="w-20 text-sm font-medium text-gray-700">{stage.stage}</span>
            <div className="flex-1 relative">
              <div className="h-8 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(stage.value / maxValue) * 100}%`,
                    backgroundColor: COLORS[idx % COLORS.length]
                  }}
                ></div>
              </div>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-700">
                {stage.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default EnrollmentFunnelChart; 
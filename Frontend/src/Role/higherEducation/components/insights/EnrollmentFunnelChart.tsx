import React, { useEffect, useState } from "react";

const COLORS = ["bg-blue-400", "bg-green-400", "bg-purple-400"];

type EnrollmentFunnelChartProps = {
  dateRange: string;
  courseType: string;
};

const EnrollmentFunnelChart: React.FC<EnrollmentFunnelChartProps> = ({ dateRange, courseType }) => {
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:3000/higherDegrees/insights/enrollment-funnel")
      .then(res => res.json())
      .then(setFunnelData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const maxValue = funnelData.length > 0 ? Math.max(...funnelData.map(d => d.value)) : 1;

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-center" style={{ height: 380 }}>
      <h2 className="font-semibold mb-2">Application Status Overview</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
      <div className="space-y-8 mt-8">
        {funnelData.map((stage, idx) => (
          <div key={stage.stage} className="flex items-center gap-2">
            <span className="w-24 text-sm font-medium">{stage.stage}</span>
            <div className="flex-1 h-10 rounded bg-gray-200 overflow-hidden">
              <div
                  className={`h-full ${COLORS[idx % COLORS.length]}`}
                style={{ width: `${(stage.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="w-10 text-right text-sm">{stage.value}</span>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default EnrollmentFunnelChart; 
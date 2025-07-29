import React, { useEffect, useState } from "react";

const getBarColor = (percent: number) => {
  if (percent > 0.8) return "bg-green-500";
  if (percent > 0.5) return "bg-yellow-400";
  return "bg-red-400";
};

const ProgramFillRate: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
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
    
    const url = "http://localhost:3000/higherDegrees/insights/program-fill-rate";
    fetch(url, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('ProgramFillRate - Data received:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setPrograms(data);
        } else {
          console.error('ProgramFillRate - Data is not an array:', data);
          setPrograms([]);
          setError('Invalid data format received');
        }
      })
      .catch((error) => {
        console.error('ProgramFillRate - Error:', error);
        setError("Failed to load data");
        setPrograms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow" style={{ height: 400 }}>
      <h2 className="font-semibold mb-4">Program Fill Rate</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {programs.map((prog) => {
            const percent = prog.seats ? prog.applicants / prog.seats : 0;
            return (
              <div key={prog.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{prog.name}</span>
                  <span className="text-sm text-gray-500">
                    {prog.applicants} / {prog.seats} ({Math.round(percent * 100)}%)
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded">
                  <div
                    className={`h-4 rounded ${getBarColor(percent)}`}
                    style={{ width: `${Math.min(percent * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgramFillRate; 
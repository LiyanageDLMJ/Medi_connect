import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type MetricData = {
  timestamps: string[];
  values: number[];
};

const MonitoringDashboard: React.FC = () => {
  const [latency, setLatency] = useState<MetricData>({ timestamps: [], values: [] });
  const [errorRate, setErrorRate] = useState<MetricData>({ timestamps: [], values: [] });
  const [requestCount, setRequestCount] = useState<MetricData>({ timestamps: [], values: [] });
  const [dbConnections, setDbConnections] = useState<MetricData>({ timestamps: [], values: [] });
  const [cpuUsage, setCpuUsage] = useState<MetricData>({ timestamps: [], values: [] });
  const [memoryUsage, setMemoryUsage] = useState<MetricData>({ timestamps: [], values: [] });

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/metrics/summary');
      const data = await response.json();
      const now = new Date().toLocaleTimeString();
      setLatency((prev) => ({ timestamps: [...prev.timestamps, now].slice(-10), values: [...prev.values, (data.apiLatency * 1000) || 0].slice(-10) }));
      setErrorRate((prev) => ({ timestamps: [...prev.timestamps, now].slice(-10), values: [...prev.values, (data.error4xx + data.error5xx) || 0].slice(-10) }));
      setRequestCount((prev) => ({ timestamps: [...prev.timestamps, now].slice(-10), values: [...prev.values, data.apiRequestCount || 0].slice(-10) }));
      setDbConnections((prev) => ({ timestamps: [...prev.timestamps, now].slice(-10), values: [...prev.values, data.dbConnections || 0].slice(-10) }));
      setCpuUsage((prev) => ({ timestamps: [...prev.timestamps, now].slice(-10), values: [...prev.values, data.cpuUsage || 0].slice(-10) }));
      setMemoryUsage((prev) => ({ timestamps: [...prev.timestamps, now].slice(-10), values: [...prev.values, (data.memoryUsage / 1024 / 1024) || 0].slice(-10) }));
    };
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <h3>API Latency (ms)</h3>
        <Line data={{ labels: latency.timestamps, datasets: [{ label: 'Latency', data: latency.values, borderColor: 'rgb(75,192,192)', tension: 0.1 }] }} />
      </div>
      <div className="card">
        <h3>API Error Rate</h3>
        <Bar data={{ labels: errorRate.timestamps, datasets: [{ label: 'Errors', data: errorRate.values, backgroundColor: 'rgba(255,99,132,0.5)' }] }} />
      </div>
      <div className="card">
        <h3>API Request Volume</h3>
        <Bar data={{ labels: requestCount.timestamps, datasets: [{ label: 'Requests', data: requestCount.values, backgroundColor: 'rgba(54,162,235,0.5)' }] }} />
      </div>
      <div className="card">
        <h3>DB Connections</h3>
        <Line data={{ labels: dbConnections.timestamps, datasets: [{ label: 'Connections', data: dbConnections.values, borderColor: 'rgb(153,102,255)', tension: 0.1 }] }} />
      </div>
      <div className="card">
        <h3>CPU Usage (%)</h3>
        <Line data={{ labels: cpuUsage.timestamps, datasets: [{ label: 'CPU', data: cpuUsage.values, borderColor: 'rgb(255,206,86)', tension: 0.1 }] }} />
      </div>
      <div className="card">
        <h3>Memory Usage (MB)</h3>
        <Line data={{ labels: memoryUsage.timestamps, datasets: [{ label: 'Memory', data: memoryUsage.values, borderColor: 'rgb(255,99,132)', tension: 0.1 }] }} />
      </div>
    </div>
  );
};

export default MonitoringDashboard; 
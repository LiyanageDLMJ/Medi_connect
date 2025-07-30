import { Request, Response } from 'express';
import { Counter, Histogram, Gauge, collectDefaultMetrics, register } from 'prom-client';

// Enable default metrics (CPU, memory, etc.)
collectDefaultMetrics();

// API Metrics
const apiRequestCounter = new Counter({
  name: 'api_requests_total',
  help: 'Total API requests',
  labelNames: ['method', 'endpoint', 'status']
});

const apiResponseTimeHistogram = new Histogram({
  name: 'api_response_time_seconds',
  help: 'API response time in seconds',
  labelNames: ['method', 'endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Database Metrics
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'collection']
});

export const dbConnectionGauge = new Gauge({
  name: 'db_connections_active',
  help: 'Active database connections'
});

// System Metrics
const cpuUsageGauge = new Gauge({
  name: 'system_cpu_usage_percent',
  help: 'Current CPU usage percentage'
});

const memoryUsageGauge = new Gauge({
  name: 'system_memory_usage_bytes',
  help: 'Current memory usage in bytes'
});

export const monitorRequest = (req: Request, res: Response, next: Function) => {
  const start = Date.now();
  
  // Use res.on('finish') instead of overriding res.end
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    apiResponseTimeHistogram.labels(req.method, req.path).observe(duration);
    apiRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc();
  });
  
  next();
};

export const getMetrics = async (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send(await register.metrics());
};

export const getMetricsSummary = async (req: Request, res: Response) => {
  // Get all metrics as text
  const metricsText = await register.metrics();
  // Helper to extract a value from the text
  const extract = (name: string) => {
    const match = metricsText.match(new RegExp(`^${name}[^\n]* ([0-9.eE+-]+)$`, 'm'));
    return match ? parseFloat(match[1]) : 0;
  };
  // Example: get the latest values for key metrics
  res.json({
    apiLatency: extract('api_response_time_seconds_sum'),
    apiRequestCount: extract('api_requests_total'),
    dbConnections: extract('db_connections_active'),
    cpuUsage: extract('system_cpu_usage_percent'),
    memoryUsage: extract('system_memory_usage_bytes'),
    error4xx: extract('http_4xx_errors_total'),
    error5xx: extract('http_5xx_errors_total'),
  });
};

// Update system metrics periodically
setInterval(() => {
  cpuUsageGauge.set(process.cpuUsage().system);
  memoryUsageGauge.set(process.memoryUsage().heapUsed);
}, 5000); 
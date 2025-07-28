import { Request, Response, NextFunction } from 'express';
import { Counter } from 'prom-client';

const error4xxCounter = new Counter({
  name: 'http_4xx_errors_total',
  help: 'Total 4xx client errors',
  labelNames: ['method', 'endpoint']
});

const error5xxCounter = new Counter({
  name: 'http_5xx_errors_total',
  help: 'Total 5xx server errors',
  labelNames: ['method', 'endpoint']
});

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  if (status >= 400 && status < 500) {
    error4xxCounter.labels(req.method, req.path).inc();
  } else if (status >= 500) {
    error5xxCounter.labels(req.method, req.path).inc();
  }
  next(err);
}; 
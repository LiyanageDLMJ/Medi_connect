import mongoose from 'mongoose';
import { dbConnectionGauge, dbQueryDuration } from '../controllers/health.controller';

export const monitorDatabase = () => {
  mongoose.plugin((schema) => {
    schema.pre(['find', 'findOne', 'update', 'delete', 'save'], function (next) {
      // @ts-ignore
      this._startTime = Date.now();
      next();
    });
    schema.post(['find', 'findOne', 'update', 'delete', 'save'], function (doc) {
      // @ts-ignore
      const duration = Date.now() - this._startTime;
      const operation = this.op;
      const collection = this.model.collection.name;
      dbQueryDuration.labels(operation, collection).observe(duration / 1000);
    });
  });
  setInterval(() => {
    dbConnectionGauge.set(mongoose.connections.length);
  }, 5000);
}; 
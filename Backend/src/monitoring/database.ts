import mongoose from 'mongoose';
import { dbConnectionGauge, dbQueryDuration } from '../controllers/health.controller';

export const monitorDatabase = () => {
  mongoose.plugin((schema) => {
    // Use individual hooks instead of array to avoid TypeScript issues
    schema.pre('find', function (this: any, next) {
      this._startTime = Date.now();
      next();
    });
    schema.pre('findOne', function (this: any, next) {
      this._startTime = Date.now();
      next();
    });
    schema.pre('updateOne', function (this: any, next) {
      this._startTime = Date.now();
      next();
    });
    schema.pre('deleteOne', function (this: any, next) {
      this._startTime = Date.now();
      next();
    });
    schema.pre('save', function (this: any, next) {
      this._startTime = Date.now();
      next();
    });

    schema.post('find', function (this: any, docs) {
      const duration = Date.now() - this._startTime;
      const operation = this.op || 'find';
      const collection = this.model?.collection?.name || 'unknown';
      dbQueryDuration.labels(operation, collection).observe(duration / 1000);
    });
    schema.post('findOne', function (this: any, doc) {
      const duration = Date.now() - this._startTime;
      const operation = this.op || 'findOne';
      const collection = this.model?.collection?.name || 'unknown';
      dbQueryDuration.labels(operation, collection).observe(duration / 1000);
    });
    schema.post('updateOne', function (this: any, result) {
      const duration = Date.now() - this._startTime;
      const operation = this.op || 'updateOne';
      const collection = this.model?.collection?.name || 'unknown';
      dbQueryDuration.labels(operation, collection).observe(duration / 1000);
    });
    schema.post('deleteOne', function (this: any, result) {
      const duration = Date.now() - this._startTime;
      const operation = this.op || 'deleteOne';
      const collection = this.model?.collection?.name || 'unknown';
      dbQueryDuration.labels(operation, collection).observe(duration / 1000);
    });
    schema.post('save', function (this: any, doc) {
      const duration = Date.now() - this._startTime;
      const operation = this.op || 'save';
      const collection = this.model?.collection?.name || 'unknown';
      dbQueryDuration.labels(operation, collection).observe(duration / 1000);
    });
  });
  
  setInterval(() => {
    dbConnectionGauge.set(mongoose.connections.length);
  }, 5000);
}; 
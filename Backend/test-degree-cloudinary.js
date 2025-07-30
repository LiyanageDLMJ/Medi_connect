// Test script for degree Cloudinary configuration
const cloudinary = require('./src/Config/cloudinaryDegreeConfig.ts');

console.log('Testing Degree Cloudinary Configuration...');

// Test the configuration
cloudinary.config({
  cloud_name: process.env.DEGREE_CLOUDINARY_CLOUD_NAME || 'dbebsni9x',
  api_key: process.env.DEGREE_CLOUDINARY_API_KEY || '451912599128183',
  api_secret: process.env.DEGREE_CLOUDINARY_API_SECRET || 'DTn6tM6KkPzgmUtid7kpCJ0dfSk',
});

console.log('Degree Cloudinary config loaded successfully!');
console.log('Cloud Name:', process.env.DEGREE_CLOUDINARY_CLOUD_NAME || 'Not set');
console.log('API Key:', process.env.DEGREE_CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('API Secret:', process.env.DEGREE_CLOUDINARY_API_SECRET ? 'Set' : 'Not set'); 
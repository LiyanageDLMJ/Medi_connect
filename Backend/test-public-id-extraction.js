// Test script to verify public_id extraction
const testUrl = 'https://res.cloudinary.com/dbebsni9x/raw/upload/v1753831456/degree-cvs/cv_1753831379016_7onn7ilsq.pdf';

console.log('Testing public_id extraction...');
console.log('Test URL:', testUrl);

// Method 1: Extract the full public_id including folder
if (testUrl.includes('/degree-cvs/')) {
  const degreeCvsIndex = testUrl.indexOf('/degree-cvs/');
  const afterDegreeCvs = testUrl.substring(degreeCvsIndex + '/degree-cvs/'.length);
  const publicId = 'degree-cvs/' + afterDegreeCvs.split('.')[0]; // Include folder prefix
  
  console.log('Debug - degreeCvsIndex:', degreeCvsIndex);
  console.log('Debug - afterDegreeCvs:', afterDegreeCvs);
  console.log('Debug - final publicId:', publicId);
  console.log('Expected publicId: degree-cvs/cv_1753831379016_7onn7ilsq');
  console.log('Extraction correct:', publicId === 'degree-cvs/cv_1753831379016_7onn7ilsq');
} 
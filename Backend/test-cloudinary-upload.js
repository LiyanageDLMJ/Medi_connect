// Test script for Cloudinary upload and download
const cloudinary = require('./src/Config/cloudinaryDegreeConfig.ts');
const fs = require('fs');
const path = require('path');

console.log('Testing Cloudinary Degree Configuration...');

async function testCloudinaryUpload() {
  try {
    // Create a simple test file
    const testContent = 'This is a test PDF content for Cloudinary upload test.';
    const testFilePath = path.join(__dirname, 'test-cv.pdf');
    
    // Write test file
    fs.writeFileSync(testFilePath, testContent);
    console.log('Created test file:', testFilePath);
    
    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    const result = await cloudinary.uploader.upload(testFilePath, {
      folder: "test-degree-cvs",
      resource_type: "raw",
      use_filename: true,
      access_mode: "public",
      public_id: `test_cv_${Date.now()}`,
      flags: "attachment",
      format: "pdf"
    });
    
    console.log('Upload successful!');
    console.log('Secure URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    // Test downloading the file
    console.log('Testing download...');
    const response = await fetch(result.secure_url);
    console.log('Download response status:', response.status);
    
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log('Download successful! File size:', buffer.byteLength, 'bytes');
    } else {
      console.log('Download failed:', response.status, response.statusText);
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCloudinaryUpload(); 
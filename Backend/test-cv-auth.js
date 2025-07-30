// Test script for CV authentication
const fetch = require('node-fetch');

console.log('Testing CV Authentication...');

async function testCvAuthentication() {
  try {
    // Test URL (replace with an actual CV URL from your database)
    const testCvUrl = 'https://res.cloudinary.com/dbebsni9x/raw/upload/v1234567890/degree-cvs/test_cv.pdf';
    const encodedUrl = encodeURIComponent(testCvUrl);
    const backendUrl = `http://localhost:3000/degreeApplications/cv/${encodedUrl}`;
    
    console.log('Testing CV endpoint without authentication...');
    const response1 = await fetch(backendUrl);
    console.log('Response without auth:', response1.status, response1.statusText);
    
    console.log('Testing CV endpoint with authentication...');
    const response2 = await fetch(backendUrl, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Response with auth:', response2.status, response2.statusText);
    
    console.log('Test completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCvAuthentication(); 
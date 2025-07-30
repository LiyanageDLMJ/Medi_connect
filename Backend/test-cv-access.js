// Test script to verify CV file access
const cloudinary = require('cloudinary').v2;

console.log('Testing CV File Access...');

// Configure cloudinary with the degree-specific values
cloudinary.config({
  cloud_name: "dbebsni9x",
  api_key: "451912599128183",
  api_secret: "DTn6tM6KkPzgmUtid7kpCJ0dfSk"
});

async function testCvAccess() {
  try {
    const publicId = 'degree-cvs/cv_1753831379016_7onn7ilsq';
    
    console.log('Testing direct URL access...');
    const directUrl = 'https://res.cloudinary.com/dbebsni9x/raw/upload/v1753831456/degree-cvs/cv_1753831379016_7onn7ilsq.pdf';
    
    // Test direct fetch
    const response = await fetch(directUrl);
    console.log('Direct fetch status:', response.status);
    
    if (response.ok) {
      console.log('✅ Direct access works!');
    } else {
      console.log('❌ Direct access failed');
    }
    
    console.log('\nTesting API access...');
    
    // Test API access
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'raw',
        type: 'upload'
      });
      console.log('✅ API access works!');
      console.log('Resource details:', {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes
      });
    } catch (apiError) {
      console.log('❌ API access failed:', apiError.message);
      
      // Try listing all resources to see what's available
      console.log('\nListing all resources...');
      const resources = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix: 'degree-cvs/',
        max_results: 10
      });
      
      console.log('Available resources:', resources.resources.map(r => ({
        public_id: r.public_id,
        secure_url: r.secure_url
      })));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCvAccess(); 
// Test script to list files in Cloudinary account
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary Files...');

// Configure cloudinary with the degree-specific values
cloudinary.config({
  cloud_name: "dbebsni9x",
  api_key: "451912599128183",
  api_secret: "DTn6tM6KkPzgmUtid7kpCJ0dfSk"
});

async function listCloudinaryFiles() {
  try {
    console.log('Listing all files in degree-cvs folder...');
    
    // List all resources in the degree-cvs folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'raw',
      prefix: 'degree-cvs/',
      max_results: 50
    });
    
    console.log('Files found:', result.resources.length);
    console.log('Resources:', result.resources.map(r => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      created_at: r.created_at
    })));
    
    // Also try to list all resources without folder filter
    console.log('\nListing all raw files...');
    const allResult = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'raw',
      max_results: 20
    });
    
    console.log('All raw files found:', allResult.resources.length);
    console.log('All resources:', allResult.resources.map(r => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      created_at: r.created_at
    })));
    
  } catch (error) {
    console.error('Error listing files:', error);
  }
}

listCloudinaryFiles(); 
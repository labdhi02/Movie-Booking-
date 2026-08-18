/**
 * Generate JWT Token for Testing
 * 
 * Usage:
 * node scripts/generate-token.js
 * 
 * Or with custom data:
 * node scripts/generate-token.js user@example.com admin
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get command line arguments or use defaults
const email = process.argv[2] || 'labdhi100@yopmail.com';
const role = process.argv[3] || 'user';

// Check if JWT secret is available
if (!process.env.SUPABASE_JWT_SECRET) {
  console.error('❌ Error: SUPABASE_JWT_SECRET not found in .env file');
  process.exit(1);
}

// Real admin user ID from database
const userId = '4b2fd1d2-fa33-4df6-9f43-0f9480385c31';


// Create JWT payload matching Supabase format
const payload = {
  sub: userId,
  email: email,
  role: 'authenticated',
  aud: 'authenticated',
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  iat: Math.floor(Date.now() / 1000),
  user_metadata: {
    first_name: 'Test',
    last_name: 'Admin'
  }
};

// Generate token
const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET, {
  algorithm: 'HS256'
});

console.log('\n✅ JWT Token Generated Successfully!\n');
console.log('📋 Token Details:');
console.log(`   Email: ${email}`);
console.log(`   User ID: ${userId}`);
console.log(`   Role in DB: ${role}`);
console.log(`   Expires: 7 days\n`);
console.log('🔑 Your Token:\n');
console.log(token);
console.log('\n📝 Usage in API calls:');
console.log(`Authorization: Bearer ${token}\n`);
console.log('⚠️  IMPORTANT: Update this user\'s role in database:');
console.log(`   UPDATE profiles SET role = '${role}' WHERE id = '${userId}';\n`);

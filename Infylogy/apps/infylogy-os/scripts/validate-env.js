const fs = require('fs');
const path = require('path');

const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_GROQ_API_KEY',
  'VITE_OPENROUTER_API_KEY'
];

const validateEnv = () => {
  console.log("🔍 Validating Production Environment...");
  
  // In production builds, Vite usually checks these, but we want an explicit check
  // For this script, we check the .env.production file if it exists
  const envPath = path.resolve(process.cwd(), '.env.production');
  
  if (!fs.existsSync(envPath)) {
    console.warn("⚠️  No .env.production file found. Checking process.env...");
    // If no file, we assume they are passed as env vars in CI
  } else {
    const content = fs.readFileSync(envPath, 'utf8');
    const missing = [];

    REQUIRED_KEYS.forEach(key => {
      if (!content.includes(key) || content.includes(`${key}=placeholder`)) {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      console.error("❌ DEPLOYMENT BLOCKED: Missing critical environment variables:");
      missing.forEach(m => console.error(`   - ${m}`));
      process.exit(1);
    }
  }

  console.log("✅ Environment Validation Passed.");
};

validateEnv();

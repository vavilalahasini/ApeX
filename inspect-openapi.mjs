import { readFileSync } from 'fs';

let envVars = {};
try {
  const envContent = readFileSync('frontend/.env.local', 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  console.error("Could not read frontend/.env.local", e);
}

const supabaseUrl = envVars.SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars');
  process.exit(1);
}

async function inspectSchema() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch schema: ${res.statusText}`);
    }
    const data = await res.json();
    console.log('API Title:', data.info?.title);
    console.log('Tables/Views:', Object.keys(data.definitions || {}));
    console.log('Paths:', Object.keys(data.paths || {}));
  } catch (e) {
    console.error('Error inspecting schema:', e);
  }
}

inspectSchema();

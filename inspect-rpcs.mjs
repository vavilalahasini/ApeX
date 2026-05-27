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

async function inspectPaths() {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  });
  const data = await res.json();
  
  for (const path of Object.keys(data.paths)) {
    if (path.startsWith('/rpc/')) {
      console.log('------------------------------------');
      console.log('RPC Path:', path);
      console.log('POST Info:', JSON.stringify(data.paths[path].post, null, 2));
    }
  }
}

inspectPaths();

import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function inspect() {
  const { data, error } = await supabase.from('contact_requests').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Successfully fetched rows:', data);
    if (data && data.length > 0) {
      console.log('Columns in table:', Object.keys(data[0]));
    } else {
      console.log('No rows in table to inspect columns.');
    }
  }
}

inspect();

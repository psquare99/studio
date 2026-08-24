require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.dev.vars' });

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function query() {
  // Get all documents
  const { data, error } = await supabase
    .from('documents')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('All documents:', JSON.stringify(data, null, 2));
}

query();
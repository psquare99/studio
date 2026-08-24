require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.dev.vars' });

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function query() {
  const { data, error } = await supabase
    .from('documents')
    .select('id, metadata, published_slug, status')
    .eq('id', 'b0361669-5304-45d0-8660-fe732274f779');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('DB State:', JSON.stringify(data, null, 2));
}

query();
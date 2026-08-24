require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.dev.vars' });

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function query() {
  // Find all published/modified documents with published_slug IS NULL
  const { data, error } = await supabase
    .from('documents')
    .select('id, status, metadata, published_at, published_slug')
    .in('status', ['published', 'modified'])
    .is('published_slug', null);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Documents with published_slug=NULL and status in (published,modified):');
  console.log(JSON.stringify(data, null, 2));
}

query();
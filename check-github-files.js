require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.dev.vars' });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function checkGitHub() {
  const response = await fetch('https://api.github.com/repos/psquare99/website/contents/content/published/journal', {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Studio-Audit'
    }
  });
  
  if (!response.ok) {
    console.error('Error:', response.status, await response.text());
    return;
  }
  
  const files = await response.json();
  console.log('Files in content/published/journal:');
  files.forEach(f => console.log(' -', f.name));
  
  // Check test1.json and test2.json specifically
  for (const name of ['test1.json', 'test2.json']) {
    const file = files.find(f => f.name === name);
    if (file) {
      console.log(`\n${name} EXISTS`);
      const content = await fetch(file.download_url).then(r => r.text());
      console.log('Content:', content.substring(0, 500));
    } else {
      console.log(`\n${name} NOT FOUND`);
    }
  }
}

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.dev.vars' });
checkGitHub();
require('dotenv').config({ path: '.dev.vars' });

async function checkJournal() {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch('https://api.github.com/repos/psquare99/website/contents/content/published/journal', {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Studio-Audit'
    }
  );
  
  const files = await response.json();
  console.log('All journal files:');
  files.forEach(f => console.log(' -', f.name));
  
  // Check test1 and test2
  for (const name of ['test1.json', 'test2.json']) {
    const file = files.find(f => f.name === name);
    if (file) {
      const content = await fetch(file.download_url).then(r => r.text());
      console.log(`\n${name}:`);
      console.log(content);
    }
  }
}

require('dotenv').config({ path: '.dev.vars' });
checkJournal();
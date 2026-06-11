const fs = require('fs');
const path = require('path');

// A simple script to catch syntax errors
const screensPath = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensPath);

files.forEach(file => {
  if (file.startsWith('Admin')) {
    try {
      const content = fs.readFileSync(path.join(screensPath, file), 'utf8');
      // Simple check to ensure export default exists
      if (!content.includes('export default')) {
        console.log(`ERROR: Missing export default in ${file}`);
      }
      
      // Simple check for React imports
      if (!content.includes('import React')) {
        console.log(`ERROR: Missing React import in ${file}`);
      }
    } catch (err) {
      console.log(`Error reading ${file}:`, err.message);
    }
  }
});

// Also check App.js
const appContent = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
if (!appContent.includes('export default function App')) {
  console.log(`ERROR: App.js might be malformed`);
}

console.log('Static check complete.');

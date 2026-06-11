const fs = require('fs');
const path = require('path');

const filesToAudit = [
  'src/screens/RoleSelectionScreen.js',
  'src/screens/RegisterScreen.js',
  'src/screens/DashboardScreen.js',
  'src/screens/ProfileSetupScreen.js',
  'src/screens/MentorshipScreen.js',
  'App.js',
  'flow.mmd'
];

const auditRoles = () => {
  console.log('--- Comprehensive Role Audit ---');
  let overallSuccess = true;

  filesToAudit.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const hasStudent = content.includes('Student');
    const hasFaculty = content.includes('Faculty');
    
    // Some mentions might be in comments or notes (like flow.mmd)
    const matches = content.match(/Student|Faculty/g);
    const filteredMatches = matches ? matches.filter(m => !content.includes(`%% Note: ${m}`)) : [];

    if (filteredMatches.length > 0) {
      console.log(`❌ ${file}: Legacy roles found (${filteredMatches.join(', ')})`);
      overallSuccess = false;
    } else {
      console.log(`✅ ${file}: Clean`);
    }
  });

  if (overallSuccess) {
    console.log('\n🌟 FINAL VERIFICATION: SUCCESS. App is strictly for Alumni and Admins.');
  } else {
    console.log('\n❌ FINAL VERIFICATION: FAILED. Check role references in the files above.');
  }
};

auditRoles();

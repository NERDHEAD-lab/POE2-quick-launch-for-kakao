import { execSync } from 'node:child_process';

console.log('📦 Starting Package Process...');

try {
    // 1. Build (TypeScript + Vite)
    console.log('\n🔨 [1/3] Building Project...');
    execSync('npm run build', { stdio: 'inherit' });

    // 2. Create Chrome Zip
    console.log('\n🤐 [2/3] Creating Chrome Extension Zip...');
    execSync('node scripts/make-zip.js', { stdio: 'inherit' });

    // 3. Create Firefox Zip
    console.log('\n🦊 [3/3] Creating Firefox Add-on Zip...');
    execSync('node scripts/make-zip-firefox.js', { stdio: 'inherit' });

    console.log('\n✅ Package Process Completed Successfully!');
} catch (error) {
    console.error('\n❌ Package Process Failed:', error.message);
    process.exit(1);
}

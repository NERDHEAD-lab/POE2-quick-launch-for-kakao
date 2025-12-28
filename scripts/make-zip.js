
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');
const yyyy = now.getFullYear();
const mm = pad(now.getMonth() + 1);
const dd = pad(now.getDate());
const HH = pad(now.getHours());
const MM = pad(now.getMinutes());

// 0. Cleanup existing zip files
const dir = process.cwd();
fs.readdirSync(dir).forEach(file => {
    if (file.startsWith('poe2-quick-launch-for-kakao-') && file.endsWith('.zip')) {
        console.log(`Removing old zip: ${file}`);
        fs.unlinkSync(path.join(dir, file));
    }
});

const timestamp = `${yyyy}${mm}${dd}-${HH}-${MM}`;
// Filename format: poe2-quick-launch-for-kakao-YYYYMMDD-HH-mm.zip
const fileName = `poe2-quick-launch-for-kakao-${timestamp}.zip`;

console.log(`Creating zip file: ${fileName}`);

// Use npx to ensure we find bestzip from node_modules
const command = `npx bestzip ${fileName} dist/`;

console.log(`Executing: ${command}`);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error creating zip: ${error.message}`);
        process.exit(1);
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`Success! Created ${fileName}`);
});

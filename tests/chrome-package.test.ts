// @vitest-environment node

import { execFileSync } from 'node:child_process';
import {
    copyFileSync,
    lstatSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    symlinkSync,
    unlinkSync,
    writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, it } from 'vitest';

function readZipEntries(zip: Buffer): string[] {
    const end = zip.lastIndexOf(Buffer.from('504b0506', 'hex'));
    expect(end).toBeGreaterThanOrEqual(0);
    const count = zip.readUInt16LE(end + 10);
    let offset = zip.readUInt32LE(end + 16);
    const entries: string[] = [];

    for (let index = 0; index < count; index++) {
        expect(zip.readUInt32LE(offset)).toBe(0x02014b50);
        const nameLength = zip.readUInt16LE(offset + 28);
        const extraLength = zip.readUInt16LE(offset + 30);
        const commentLength = zip.readUInt16LE(offset + 32);
        entries.push(zip.subarray(offset + 46, offset + 46 + nameLength).toString('utf8'));
        offset += 46 + nameLength + extraLength + commentLength;
    }

    return entries;
}

it('packages the Chrome manifest and runtime assets at the ZIP root', () => {
    const projectRoot = fileURLToPath(new URL('../', import.meta.url));
    const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'kakao chrome package-'));
    const modulesLink = path.join(fixtureRoot, 'node_modules');

    try {
        mkdirSync(path.join(fixtureRoot, 'scripts'));
        mkdirSync(path.join(fixtureRoot, 'dist', 'assets'), { recursive: true });
        mkdirSync(path.join(fixtureRoot, 'dist', 'icons'));
        copyFileSync(
            path.join(projectRoot, 'scripts', 'make-zip.js'),
            path.join(fixtureRoot, 'scripts', 'make-zip.js')
        );
        writeFileSync(
            path.join(fixtureRoot, 'package.json'),
            JSON.stringify({ name: 'chrome-package-fixture', version: '1.2.3', type: 'module' })
        );
        writeFileSync(
            path.join(fixtureRoot, 'dist', 'manifest.json'),
            JSON.stringify({
                manifest_version: 3,
                name: 'Packaging fixture',
                version: '1.2.3',
                background: { service_worker: 'assets/background.js' },
                action: { default_popup: 'popup.html' },
                icons: { 128: 'icons/128.png' }
            })
        );
        writeFileSync(path.join(fixtureRoot, 'dist', 'popup.html'), '<p>Popup</p>');
        writeFileSync(path.join(fixtureRoot, 'dist', 'assets', 'background.js'), 'console.log(1);');
        writeFileSync(path.join(fixtureRoot, 'dist', 'icons', '128.png'), 'fixture icon');
        symlinkSync(path.join(projectRoot, 'node_modules'), modulesLink, 'junction');

        execFileSync(process.execPath, [path.join(fixtureRoot, 'scripts', 'make-zip.js')], {
            cwd: fixtureRoot,
            timeout: 20000
        });

        const entries = readZipEntries(
            readFileSync(path.join(fixtureRoot, 'chrome-package-fixture-v1.2.3.zip'))
        );
        expect(entries).toEqual(
            expect.arrayContaining([
                'manifest.json',
                'popup.html',
                'assets/background.js',
                'icons/128.png'
            ])
        );
        expect(entries.some((entry) => entry.startsWith('dist/'))).toBe(false);
    } finally {
        // Remove the dependency link before recursively deleting this owned fixture.
        if (lstatSync(modulesLink, { throwIfNoEntry: false })) unlinkSync(modulesLink);
        rmSync(fixtureRoot, { recursive: true, force: true });
    }
}, 30000);

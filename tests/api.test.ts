import { describe, it, expect } from 'vitest';

import { fetchNotices } from '../src/notice';
import { fetchPatchNotes } from '../src/patch-notes';

describe('API Deserialization Tests', () => {
    it('Notice API', async () => {
        const notices = await fetchNotices();
        console.log(`Fetched ${notices.length} notices`);

        expect(Array.isArray(notices), 'Notices should be an array').toBe(true);

        if (notices.length > 0) {
            const notice = notices[0];
            expect(notice).toHaveProperty('title');
            expect(notice).toHaveProperty('link');
            expect(notice).toHaveProperty('targetGame');
            expect(Array.isArray(notice.targetGame), 'targetGame should be array').toBe(true);
        }
    }, 10000);

    it('Patch Notes (POE)', async () => {
        const notes = await fetchPatchNotes('poe', 5);
        console.log(`Fetched ${notes.length} POE notes`);

        expect(Array.isArray(notes)).toBe(true);
        // We expect at least some notes usually, unless forum is empty or blocked
        if (notes.length > 0) {
            const note = notes[0];
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('link');
            expect(note).toHaveProperty('date');
        }
    }, 10000);

    it('Patch Notes (POE2)', async () => {
        const notes = await fetchPatchNotes('poe2', 5);
        console.log(`Fetched ${notes.length} POE2 notes`);

        expect(Array.isArray(notes)).toBe(true);
        if (notes.length > 0) {
            const note = notes[0];
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('link');
        }
    }, 10000);
});

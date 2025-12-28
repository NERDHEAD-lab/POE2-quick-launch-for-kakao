import { PatchNote } from './storage';

export const URLS = {
    poe1: 'https://poe.game.daum.net/forum/view-forum/patch-notes',
    poe2: 'https://poe.game.daum.net/forum/view-forum/patch-notes2',
};

export async function fetchPatchNotes(game: 'poe1' | 'poe2', limit: number): Promise<PatchNote[]> {
    try {
        const url = URLS[game];
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const rows = Array.from(doc.querySelectorAll('table.forumTable tr:not(.heading)'));
        const notes: PatchNote[] = [];

        for (const row of rows) {
            if (notes.length >= limit) break;

            // Skip sticky posts
            if (row.querySelector('.flag.sticky')) continue;

            const titleEl = row.querySelector('.title a') as HTMLAnchorElement;
            const dateEl = row.querySelector('.postBy .post_date') as HTMLSpanElement;

            if (titleEl && dateEl) {
                const title = titleEl.innerText.trim();
                const link = `https://poe.game.daum.net${titleEl.getAttribute('href')}`;
                const dateStr = dateEl.innerText.replace(/^, /, '').trim();

                notes.push({
                    title,
                    link,
                    date: dateStr,
                    isNew: false // Default false, computed later against cache
                });
            }
        }

        return notes;
    } catch (error) {
        console.error('Failed to fetch patch notes', error);
        return [];
    }
}

export function getPatchNoteUrl(game: 'poe1' | 'poe2'): string {
    return URLS[game];
}

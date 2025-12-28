
export interface PatchNote {
    title: string;
    link: string;
    date: string;
    isNew: boolean;
}

const URLS = {
    poe1: 'https://poe.game.daum.net/forum/view-forum/patch-notes',
    poe2: 'https://poe.game.daum.net/forum/view-forum/patch-notes2',
};

export async function fetchPatchNotes(game: 'poe1' | 'poe2', limit: number, lastRead: number): Promise<PatchNote[]> {
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

                // Parse date to check if new
                // Format example: 2024. 12. 29. 오전 12:00:00
                // We need a rough robust parsing or just string comparison if format is strict
                // Let's try to parse it to timestamp for comparison
                const timestamp = parseKoreanDate(dateStr);

                notes.push({
                    title,
                    link,
                    date: dateStr,
                    isNew: timestamp > lastRead
                });
            }
        }

        return notes;
    } catch (error) {
        console.error('Failed to fetch patch notes', error);
        return [];
    }
}

function parseKoreanDate(dateStr: string): number {
    try {
        // Remove "오전"/"오후" and replace with AM/PM for standard parsing or handle manually
        // 2024. 12. 29. 오전 12:00:00
        // Regex to extract parts
        const match = dateStr.match(/(\d{4})\. (\d{1,2})\. (\d{1,2})\. (오전|오후) (\d{1,2}):(\d{1,2}):(\d{1,2})/);
        if (!match) return 0;

        let [_, y, m, d, mer, h, min, s] = match;
        let hour = parseInt(h);
        if (mer === '오후' && hour < 12) hour += 12;
        if (mer === '오전' && hour === 12) hour = 0;

        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), hour, parseInt(min), parseInt(s));
        return date.getTime();
    } catch (e) {
        return 0;
    }
}

export function getPatchNoteUrl(game: 'poe1' | 'poe2'): string {
    return URLS[game];
}

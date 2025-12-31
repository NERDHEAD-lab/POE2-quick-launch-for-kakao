import { describe, it, expect } from 'vitest';

import { EXT_URLS } from '../src/constants';

async function checkUrl(url: string, retries = 3): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            // Use fetch with HEAD logic in test env if server supports it, otherwise GET
            // Some servers block HEAD, so GET is safer for "reachability" despite bandwidth
            const res = await fetch(url, {
                method: 'GET',
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0 (Testbot)' }
            });
            clearTimeout(timeoutId);

            if (res.ok) return true;
            console.warn(`[Attempt ${i + 1}] Failed: ${url} (Status: ${res.status})`);
        } catch (e) {
            console.warn(`[Attempt ${i + 1}] Error: ${url}`, e);
        }
        // Wait before retry
        await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
}

describe('URL Reachability Tests', () => {
    // Flatten URL object
    const urlsToTest = [
        ...Object.values(EXT_URLS.POE),
        ...Object.values(EXT_URLS.POE2),
        EXT_URLS.NOTICE_JSON
    ];

    urlsToTest.forEach((url) => {
        it(`should reach ${url}`, async () => {
            const result = await checkUrl(url);
            expect(result).toBe(true);
        });
    });
});

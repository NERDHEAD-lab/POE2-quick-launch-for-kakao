/// <reference types="vite/client" />
/**
 * Periodically checks if the extension context is still valid.
 * If invalid (e.g., extension reloaded/updated), reloads the current window/frame
 * to reconnect to the new extension instance.
 */
export function startContextHeartbeat() {
    setInterval(() => {
        // 1. Basic Check: Runtime Object presence
        if (!chrome.runtime?.id) {
            // [Dev Only] Attempt to click 'Reload Extension' button from Vite Overlay
            if (import.meta.env.DEV) {
                const handled = attemptViteReloadClick();
                if (handled) return; // Skip page reload if we clicked the button
            }

            console.warn(
                '[Context] Extension Runtime ID missing. Context invalidated. Reloading...'
            );
            globalThis.location.reload();
            return;
        }

        // 2. Deep Check: Try accessing a standard API
        try {
            chrome.runtime.getURL('');
        } catch (e) {
            console.warn(
                '[Context] Extension Context Invalidated (API access failed). Reloading...',
                e
            );
            globalThis.location.reload();
        }
    }, 1000);
}

/**
 * [Dev Only] Helper to find and click the 'Reload Extension' button injected by @crxjs/vite-plugin
 */
function attemptViteReloadClick(): boolean {
    try {
        // The overlay is usually in a Shadow Root.
        // We perform a simple recursive search for the button.
        // Performance note: This only runs when the extension is already broken.
        const findBtn = (root: Node): HTMLElement | null => {
            if (root instanceof HTMLElement && root.shadowRoot) {
                const res = findBtn(root.shadowRoot);
                if (res) return res;
            }

            if (root instanceof HTMLElement && root.tagName === 'BUTTON') {
                if (root.innerText?.includes('Reload Extension')) {
                    return root;
                }
            }

            if (root.childNodes) {
                for (const child of Array.from(root.childNodes)) {
                    const res = findBtn(child);
                    if (res) return res;
                }
            }
            return null;
        };

        const btn = findBtn(document.body);
        if (btn) {
            console.log('[Dev] Found Vite "Reload Extension" button. Clicking...');
            btn.click();
            return true;
        }
    } catch {
        // Ignore errors during search
    }
    return false;
}

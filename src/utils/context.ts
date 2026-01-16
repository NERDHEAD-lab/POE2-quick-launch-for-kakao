/**
 * Periodically checks if the extension context is still valid.
 * If invalid (e.g., extension reloaded/updated), reloads the current window/frame
 * to reconnect to the new extension instance.
 */
export function startContextHeartbeat() {
    setInterval(() => {
        // 1. Basic Check: Runtime Object presence
        if (!chrome.runtime?.id) {
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

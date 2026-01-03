// Detector script for POE2 Patch Butler integration

(() => {
    // Only run on the specific host
    if (window.location.hostname !== 'nerdhead-lab.github.io') {
        return;
    }

    const verifyExtension = async (port: string) => {
        try {
            // [Modified] Use Background Proxy to avoid PNA/Mixed Content issues
            const response = await chrome.runtime.sendMessage({ action: 'proxyVerify', port });

            if (response && response.success && response.data && response.data.status === 'ok') {
                const data = response.data;
                console.log('[POE2 Quick Launch] Patch Butler verified on port:', port);

                // Notify the web page
                document.body.dataset.poe2ExtensionVerified = 'true';
                document.body.dataset.poe2ExtensionVersion = chrome.runtime.getManifest().version;

                // Dispatch event for SPA or listeners
                window.dispatchEvent(
                    new CustomEvent('poe2-patch-butler-verified', {
                        detail: {
                            port,
                            version: chrome.runtime.getManifest().version,
                            butlerVersion: data.version
                        }
                    })
                );
            }
        } catch (e) {
            console.debug('[POE2 Quick Launch] Failed to verify Patch Butler:', e);
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const extPort = urlParams.get('ext_port');
    const action = urlParams.get('action');

    if (extPort) {
        // [Modified] Always verify first (Guideline: Check -> Act)
        verifyExtension(extPort).then(() => {
            if (action === 'enable_auto_launch') {
                // Special Action: Enable Auto Launch Confirmation via Proxy
                chrome.runtime.sendMessage(
                    { action: 'proxyEnableAutoLaunch', port: extPort },
                    (response) => {
                        if (response && response.success) {
                            console.log('[POE2 Quick Launch] Auto Launch Enabled via Tool.');

                            // Notify the web page
                            window.dispatchEvent(
                                new CustomEvent('poe2-patch-butler-auto-launch-enabled', {
                                    detail: { status: 'enabled' }
                                })
                            );
                        } else {
                            console.log(
                                '[POE2 Quick Launch] Failed to enable auto launch via proxy.'
                            );
                        }
                    }
                );
            }
        });
    }
})();

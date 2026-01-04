import { MessageRequest } from './types/message';

// Message types
console.log('!!! Background Service Worker Initialized !!!');

// -----------------------------------------------------------------------------
// Install / Update Handler
// -----------------------------------------------------------------------------
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.storage.local.get(['isTutorialMode'], (result) => {
            if (result.isTutorialMode === undefined) {
                console.log(
                    '[Background] Fresh install (No Settings). Setting Tutorial Mode = ON.'
                );
                chrome.storage.local.set({ isTutorialMode: true });
            } else {
                console.log(
                    '[Background] Install detected but settings exist. Preserving existing Tutorial Mode.'
                );
            }
        });
    } else if (details.reason === 'update') {
        chrome.storage.local.get(['isTutorialMode'], (result) => {
            if (result.isTutorialMode === undefined) {
                console.log(
                    '[Background] Update detected. Initializing Tutorial Mode to OFF for existing user.'
                );
                chrome.storage.local.set({ isTutorialMode: false });
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
    console.log('Background received message:', request, 'from sender:', sender);

    if (request.action === 'closeTab') {
        const tabId = sender.tab?.id;
        if (tabId) {
            console.log('[Background] Received closeTab signal. Closing current tab in 1s:', tabId);
            setTimeout(() => {
                chrome.tabs.remove(tabId, () => {
                    if (chrome.runtime.lastError) {
                        console.warn(
                            '[Background] Failed to close tab (maybe already closed):',
                            chrome.runtime.lastError
                        );
                    } else {
                        console.log('[Background] Launcher tab closed successfully.');
                    }
                });
            }, 1000);
        }
    }

    if (request.action === 'registerMainTab') {
        if (sender.tab?.id) {
            chrome.storage.session.set({ mainGameTabId: sender.tab.id });
            console.log('[Background] Registered Main Game Tab ID:', sender.tab.id);
        }
    } else if (request.action === 'closeMainTab') {
        chrome.storage.session.get(['mainGameTabId'], (result) => {
            const tabId = result['mainGameTabId'] as number | undefined;
            if (!tabId) {
                console.warn('[Background] received closeMainTab but no ID found in session.');
                return;
            }

            console.log('[Background] Received closeMainTab signal. Closing tab in 1s:', tabId);

            setTimeout(() => {
                chrome.tabs.remove(tabId, () => {
                    const err = chrome.runtime.lastError;
                    if (err)
                        console.warn(
                            '[Background] Failed to close tab (maybe already closed):',
                            err
                        );
                    else console.log('[Background] Main Game Tab closed successfully.');

                    // Cleanup session storage
                    chrome.storage.session.remove('mainGameTabId');
                });
            }, 1000);
        });
    }

    // -----------------------------------------------------------------------------
    // Proxy Handlers for Patch Butler Integration (PNA Bypass)
    // -----------------------------------------------------------------------------
    if (request.action === 'proxyVerify') {
        // [Goal] Check if local tool is running
        const port = request.port;
        if (!port) return;

        fetch(`http://127.0.0.1:${port}/verify`)
            .then((res) => res.json())
            .then((data) => sendResponse({ success: true, data }))
            .catch((err) => sendResponse({ success: false, error: err.toString() }));
        return true; // Async response
    }

    if (request.action === 'proxyEnableAutoLaunch') {
        const port = request.port;
        if (!port) return;

        fetch(`http://127.0.0.1:${port}/enable_auto_launch`)
            .then((res) => {
                if (res.ok) sendResponse({ success: true });
                else sendResponse({ success: false, error: `Status: ${res.status}` });
            })
            .catch((err) => sendResponse({ success: false, error: err.toString() }));
        return true; // Async response
    }

    if (request.action === 'proxyAck') {
        const port = request.port;
        if (!port) return;

        fetch(`http://127.0.0.1:${port}/ack`)
            .then((res) => {
                if (res.ok) sendResponse({ success: true });
                else sendResponse({ success: false, error: `Status: ${res.status}` });
            })
            .catch((err) => sendResponse({ success: false, error: err.toString() }));
        return true; // Async response
    }

    if (request.action === 'remoteLog' && request.logData) {
        const { handlerName, url, referrer, message, timestamp } = request.logData;
        const logPrefix = `[Remote Log][${timestamp}][${handlerName}]`;

        console.log(`${logPrefix} URL: ${url}`);
        console.log(`${logPrefix} Referrer: ${referrer}`);
        if (message) console.log(`${logPrefix} Message: ${message}`);

        // Forward to Main Tab if exists
        chrome.storage.session.get(['mainGameTabId'], (result) => {
            const tabId = result['mainGameTabId'] as number | undefined;
            if (tabId) {
                chrome.tabs
                    .sendMessage(tabId, {
                        action: 'forwardLog',
                        logData: request.logData
                    })
                    .catch(() => {
                        // Ignore errors if the tab is not in a state to receive messages
                    });
            }
        });
    }
});

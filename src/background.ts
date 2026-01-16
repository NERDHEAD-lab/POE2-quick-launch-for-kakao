import { loadSettings, STORAGE_KEYS } from './storage';
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

let mismatchTimerId: ReturnType<typeof setTimeout> | null = null;

chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
    console.log('Background received message:', request, 'from sender:', sender);

    switch (request.action) {
        // Tab Management
        case 'registerMainTab':
        case 'closeMainTab':
        case 'notifyMismatchDetected':
        case 'notifyHandlerTriggered':
            handleTabManagement(request, sender);
            break;

        // Proxy Handlers (Async response)
        case 'proxyVerify':
        case 'proxyEnableAutoLaunch':
        case 'proxyAck':
            handleProxyRequest(request, sendResponse);
            return true; // Keep channel open

        // Logging
        case 'remoteLog':
            handleRemoteLog(request);
            break;
    }
});

function handleTabManagement(request: MessageRequest, sender: chrome.runtime.MessageSender) {
    switch (request.action) {
        case 'registerMainTab':
            if (sender.tab?.id) {
                chrome.storage.session.set({ mainGameTabId: sender.tab.id });
                console.log('[Background] Registered Main Game Tab ID:', sender.tab.id);
            }
            break;
        case 'closeMainTab':
            closeMainTabWithDelay(2000);
            break;
        case 'notifyMismatchDetected':
            if (mismatchTimerId !== null) clearTimeout(mismatchTimerId);
            mismatchTimerId = setTimeout(() => {
                loadSettings().then((settings) => {
                    if (settings.isTutorialMode) {
                        console.log('Tutorial Mode: OFF. Future runs will auto-close.');
                        chrome.storage.local.set({ [STORAGE_KEYS.IS_TUTORIAL_MODE]: false });
                    }
                    if (!settings.closeTab) return;

                    console.log(
                        '[Background] Mismatch Timer Expired. No other handler took over. Closing Main Tab.'
                    );
                    closeMainTabWithDelay(2000);
                    mismatchTimerId = null;
                });
            }, 2000);
            break;
        case 'notifyHandlerTriggered':
            if (mismatchTimerId !== null) {
                console.log('[Background] Handler triggered! Cancelling Mismatch Timer.');
                clearTimeout(mismatchTimerId);
                mismatchTimerId = null;
            }
            break;
    }
}

function handleProxyRequest(
    request: MessageRequest,
    sendResponse: (response?: { success: boolean; data?: unknown; error?: string }) => void
) {
    const port = request.port;
    if (!port) return;

    let endpoint = '';
    switch (request.action) {
        case 'proxyVerify':
            endpoint = '/verify';
            break;
        case 'proxyEnableAutoLaunch':
            endpoint = '/enable_auto_launch';
            break;
        case 'proxyAck':
            endpoint = '/ack';
            break;
    }

    fetch(`http://127.0.0.1:${port}${endpoint}`)
        .then((res) => {
            if (request.action === 'proxyVerify') return res.json();
            if (res.ok) return { success: true };
            throw new Error(`Status: ${res.status}`);
        })
        .then((data) => {
            // For verify, data is the JSON. For others, it's {success: true}
            if (request.action === 'proxyVerify') sendResponse({ success: true, data });
            else sendResponse(data);
        })
        .catch((err) => sendResponse({ success: false, error: err.toString() }));
}

function handleRemoteLog(request: MessageRequest) {
    if (!request.logData) return;

    const { handlerName, url, referrer, message, timestamp } = request.logData;
    const logPrefix = `[Remote Log][${timestamp}][${handlerName}]`;

    console.log(`${logPrefix} URL: ${url}`);
    console.log(`${logPrefix} Referrer: ${referrer}`);
    if (message) console.log(`${logPrefix} Message: ${message}`);

    chrome.storage.session.get(['mainGameTabId'], (result) => {
        const tabId = result['mainGameTabId'] as number | undefined;
        if (tabId) {
            chrome.tabs
                .sendMessage(tabId, {
                    action: 'forwardLog',
                    logData: request.logData
                })
                .catch(() => {});
        }
    });
}

// Helper for closing Main Tab
function closeMainTabWithDelay(delayMs: number) {
    chrome.storage.session.get(['mainGameTabId'], (result) => {
        const tabId = result['mainGameTabId'] as number | undefined;
        if (!tabId) {
            console.warn('[Background] No Main Game Tab ID found to close.');
            return;
        }

        console.log(`[Background] Closing Main Game Tab (${tabId}) in ${delayMs}ms...`);
        setTimeout(() => {
            chrome.tabs.remove(tabId, () => {
                const err = chrome.runtime.lastError;
                if (err) console.warn('[Background] Failed to close tab:', err);
                else console.log('[Background] Main Game Tab closed successfully.');

                chrome.storage.session.remove('mainGameTabId');
            });
        }, delayMs);
    });
}

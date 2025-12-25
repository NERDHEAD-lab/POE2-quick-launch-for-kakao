// Message types
console.log('!!! Background Service Worker Initialized !!!');

interface MessageRequest {
    action: string;
}

chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
    console.log('Background received message:', request, 'from sender:', sender);

    if (request.action === 'closeTab') {
        if (sender.tab && sender.tab.id) {
            chrome.tabs.remove(sender.tab.id);
        }
    }

    if (request.action === 'launcherGameStartClicked') {
        console.log('Background received "Game Start Clicked". Starting 5s safety timer...');
        sendResponse('ok'); // Acknowledge receipt to prevent "Port closed" error in content script

        // 1. Wait 5 seconds (Safety for UAC / Custom Protocol)
        // This timer runs in the Background, so it persists even if the Launcher Tab closes instantly.
        setTimeout(() => {
            console.log('5s Safety Timer finished. Proceeding to close tabs...');

            // 2. Close the Launcher Popup (if valid)
            if (sender.tab && sender.tab.id) {
                console.log('Closing Launcher tab:', sender.tab.id);
                chrome.tabs.remove(sender.tab.id).catch(() => console.log('Launcher tab likely already closed.'));
            }

            // 3. Wait 1 second, then close the Main Page
            setTimeout(() => {
                chrome.tabs.query({ url: "*://*.game.daum.net/*" }, (tabs) => {
                    const mainPageTabs = tabs.filter(t => t.url && t.url.includes('/main'));
                    const tabIds = mainPageTabs.map(t => t.id).filter((id): id is number => id !== undefined);

                    if (tabIds.length > 0) {
                        console.log('[Background] Closing Main Page tab(s):', tabIds);
                        chrome.tabs.remove(tabIds);
                    } else {
                        console.log('[Background] No Main Page tabs found to close.');
                    }
                });
            }, 1000);
        }, 5000);
    } else if (request.action === 'checkAutoSequence') {
        chrome.storage.session.get(['isAutoSequence'], (result) => {
            sendResponse({ isAutoSequence: result['isAutoSequence'] });
        });
        return true; // Will respond asynchronously
    }
});

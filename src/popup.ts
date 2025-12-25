// popup.ts

// Type assertions for stronger typing
const closeTabToggle = document.getElementById('closeTabToggle') as HTMLInputElement;
const closePopupToggle = document.getElementById('closePopupToggle') as HTMLInputElement;
const pluginDisableToggle = document.getElementById('pluginDisableToggle') as HTMLInputElement;
const launchBtn = document.getElementById('launchBtn') as HTMLAnchorElement;
const settingsToggle = document.getElementById('settingsToggle') as HTMLElement;
const settingsContent = document.getElementById('settingsContent') as HTMLElement;

// Load saved settings
chrome.storage.local.get(['closeTab', 'closePopup', 'isPluginDisabled'], (result) => {
    closeTabToggle.checked = result.closeTab !== false; // Default true
    closePopupToggle.checked = result.closePopup !== false; // Default true

    // Plugin Disable State
    const isPluginDisabled = result.isPluginDisabled === true;
    pluginDisableToggle.checked = isPluginDisabled;
    updatePluginDisabledState(isPluginDisabled);
});

// Settings Toggle Logic
if (settingsToggle && settingsContent) {
    settingsToggle.addEventListener('click', () => {
        const isOpen = settingsContent.classList.toggle('open');
        settingsToggle.classList.toggle('active', isOpen);
    });
}

// Save settings on change
closeTabToggle.addEventListener('change', () => {
    chrome.storage.local.set({ closeTab: closeTabToggle.checked });
});

closePopupToggle.addEventListener('change', () => {
    chrome.storage.local.set({ closePopup: closePopupToggle.checked });
});

// Plugin Disable Toggle Logic
pluginDisableToggle.addEventListener('change', () => {
    const isDisabled = pluginDisableToggle.checked;
    chrome.storage.local.set({ isPluginDisabled: isDisabled });
    updatePluginDisabledState(isDisabled);
});

function updatePluginDisabledState(isDisabled: boolean) {
    if (isDisabled) {
        document.body.classList.add('plugin-disabled');
        launchBtn.style.pointerEvents = 'none'; // Disable link click
        launchBtn.removeAttribute('href');
    } else {
        document.body.classList.remove('plugin-disabled');
        launchBtn.style.pointerEvents = 'auto';
        launchBtn.href = '#'; // Restore href
    }
}

// Launch Game Button Logic
launchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (document.body.classList.contains('plugin-disabled')) {
        return; // Do nothing if disabled
    }

    // 1. Get Settings
    // Removed unused isCloseTabFn
    const isClosePopupFn = closePopupToggle.checked;

    chrome.tabs.create({ url: 'https://pathofexile2.game.daum.net/main#autoStart' }, (tab) => {
        if (tab && tab.id) {
            // Logic handled by content scripts
        }
    });

    // Handle "Close Popup" immediately if requested
    if (isClosePopupFn) {
        window.close();
    }
});

// popup.ts

// Type assertions for stronger typing
const closeTabToggle = document.getElementById('closeTabToggle') as HTMLInputElement;
const closePopupToggle = document.getElementById('closePopupToggle') as HTMLInputElement;
const pluginDisableToggle = document.getElementById('pluginDisableToggle') as HTMLInputElement;
const launchBtn = document.getElementById('launchBtn') as HTMLAnchorElement;
const fixGuideBtn = document.getElementById('fixGuideBtn') as HTMLAnchorElement;

// Game Switcher Elements
const logoPoe = document.getElementById('logoPoe') as HTMLImageElement;
const logoPoe2 = document.getElementById('logoPoe2') as HTMLImageElement;

// Stacked Drawer Elements
const settingsToggle = document.getElementById('settingsToggle') as HTMLElement;
const settingsContent = document.getElementById('settingsContent') as HTMLElement;
const patchNotesToggle = document.getElementById('patchNotesToggle') as HTMLElement;
const patchNotesContent = document.getElementById('patchNotesContent') as HTMLElement;

type GameType = 'poe' | 'poe2';
let selectedGame: GameType = 'poe2'; // Default

// Game Configuration
const GAME_CONFIG = {
    poe: {
        bgClass: 'bg-poe',
        url: 'https://poe.game.daum.net#autoStart',
        showFixGuide: false
    },
    poe2: {
        bgClass: 'bg-poe2',
        url: 'https://pathofexile2.game.daum.net/main#autoStart',
        showFixGuide: true
    }
};

function updateGameUI(game: GameType) {
    selectedGame = game;
    const config = GAME_CONFIG[game];

    // 1. Background
    document.body.classList.remove('bg-poe', 'bg-poe2');
    document.body.classList.add(config.bgClass);

    // 2. Logos (Active/Inactive)
    if (game === 'poe') {
        logoPoe.classList.remove('inactive');
        logoPoe2.classList.add('inactive');
    } else {
        logoPoe.classList.add('inactive');
        logoPoe2.classList.remove('inactive');
    }

    // 3. Launch Button URL (Stored in dataset or variable for click handler)
    launchBtn.dataset.url = config.url;

    // 4. Fix Guide Visibility
    if (config.showFixGuide) {
        fixGuideBtn.style.display = 'flex'; // or whatever flex style used
    } else {
        fixGuideBtn.style.display = 'none';
    }
}

// Mutual Exclusion Drawer Logic
function toggleDrawerStack(target: 'settings' | 'patchNotes') {
    const isSettingsTarget = target === 'settings';

    if (isSettingsTarget) {
        // Toggle Settings
        const willOpen = !settingsContent.classList.contains('open');
        settingsContent.classList.toggle('open', willOpen);
        settingsToggle.classList.toggle('active', willOpen);

        // Close Patch Notes
        if (willOpen) {
            patchNotesContent.classList.remove('open');
            patchNotesToggle.classList.remove('active');
        }
    } else {
        // Toggle Patch Notes
        const willOpen = !patchNotesContent.classList.contains('open');
        patchNotesContent.classList.toggle('open', willOpen);
        patchNotesToggle.classList.toggle('active', willOpen);

        // Close Settings
        if (willOpen) {
            settingsContent.classList.remove('open');
            settingsToggle.classList.remove('active');
        }
    }
}

if (settingsToggle) {
    settingsToggle.addEventListener('click', () => toggleDrawerStack('settings'));
}

if (patchNotesToggle) {
    patchNotesToggle.addEventListener('click', () => toggleDrawerStack('patchNotes'));
}

// Logo Click Listeners
logoPoe.addEventListener('click', () => {
    if (selectedGame !== 'poe') {
        updateGameUI('poe');
        chrome.storage.local.set({ selectedGame: 'poe' });
    }
});

logoPoe2.addEventListener('click', () => {
    if (selectedGame !== 'poe2') {
        updateGameUI('poe2');
        chrome.storage.local.set({ selectedGame: 'poe2' });
    }
});

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
    const targetUrl = launchBtn.dataset.url || GAME_CONFIG.poe2.url; // Fallback

    chrome.tabs.create({ url: targetUrl }, (tab) => {
        if (tab && tab.id) {
            // Logic handled by content scripts
        }

        // Handle "Close Popup" only after tab creation is initiated
        if (isClosePopupFn) {
            window.close();
        }
    });
});

// Load Settings on Startup
function loadSettings() {
    chrome.storage.local.get(['closeTab', 'closePopup', 'isPluginDisabled', 'selectedGame'], (result) => {
        if (result.closeTab !== undefined) {
            closeTabToggle.checked = result.closeTab as boolean;
        }
        if (result.closePopup !== undefined) {
            closePopupToggle.checked = result.closePopup as boolean;
        }
        if (result.isPluginDisabled !== undefined) {
            const isDisabled = result.isPluginDisabled as boolean;
            pluginDisableToggle.checked = isDisabled;
            // Apply initial visual state
            updatePluginDisabledState(isDisabled);
        }

        // Load Game State
        const savedGame = (result.selectedGame as GameType) || 'poe2';
        updateGameUI(savedGame);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadSettings);

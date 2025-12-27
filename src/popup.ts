// popup.ts
import { loadSettings, saveSetting, STORAGE_KEYS, GameType } from './storage';

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

let selectedGame: GameType = 'poe2'; // Default local state, will be updated from storage

import bgPoe from './assets/poe/bg-keepers.png';
import bgPoe2 from './assets/poe2/bg-forest.webp';

// Game Configuration
const GAME_CONFIG = {
    poe: {
        bgClass: 'bg-poe',
        bgImage: bgPoe,
        url: 'https://poe.game.daum.net#autoStart',
        showFixGuide: false,
        fallback: {
            text: '#c8c8c8',
            accent: '#dfcf99', // Gold
            footer: '#1a1510'   // Dark Brown/Black
        }
    },
    poe2: {
        bgClass: 'bg-poe2',
        bgImage: bgPoe2,
        url: 'https://pathofexile2.game.daum.net/main#autoStart',
        showFixGuide: true,
        fallback: {
            text: '#b5c2b5',
            accent: '#aaddaa', // Mint
            footer: '#0c150c'  // Dark Green
        }
    }
};

// --- Color Utils ---
function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

async function extractThemeColors(imageUrl: string, fallback: { text: string, accent: string, footer: string }): Promise<{ text: string, accent: string, footer: string }> {
    return new Promise((resolve) => {
        const img = new Image();
        // Removed crossOrigin as it can cause issues with local extension assets
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(fallback);

            // Sample the image (resize to 1x1 to get average)
            canvas.width = 1;
            canvas.height = 1;
            ctx.drawImage(img, 0, 0, 1, 1);
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

            // Convert to HSL for adjustment
            let [h, s, l] = rgbToHsl(r, g, b);

            // 1. Accent: Keep Hue, Boost Saturation
            const accentS = Math.max(s * 100, 50);
            const accentL = Math.max(Math.min(l * 100 * 1.5, 80), 60);
            const accent = hslToHex(h, accentS, accentL);

            // 2. Text: Slight Tint
            const textS = Math.min(s * 100, 20);
            const textL = 90;
            const text = hslToHex(h, textS, textL);

            // 3. Footer BG: Very Dark version of Hue
            const footerS = Math.min(s * 100, 20);
            const footerL = 8;
            const footer = hslToHex(h, footerS, footerL);

            resolve({ text, accent, footer });
        };
        img.onerror = () => {
            console.warn('Failed to load bg image, using fallback:', imageUrl);
            resolve(fallback);
        };
    });
}

async function updateGameUI(game: GameType) {
    selectedGame = game; // Update local state
    const config = GAME_CONFIG[game];

    // 1. Background
    document.body.classList.remove('bg-poe', 'bg-poe2');
    document.body.classList.add(config.bgClass);

    // 2. Dynamic Color Extraction
    try {
        const colors = await extractThemeColors(config.bgImage, config.fallback);
        document.body.style.setProperty('--theme-text', colors.text);
        document.body.style.setProperty('--theme-accent', colors.accent);
        document.body.style.setProperty('--theme-footer-bg', colors.footer);
        console.log(`[Theme] ${game} -> Accent: ${colors.accent}, Footer: ${colors.footer}`);
    } catch (e) {
        console.warn('Theme color extraction failed completely, using fallback.', e);
        // Apply fallback directly in case of catastrophe
        document.body.style.setProperty('--theme-text', config.fallback.text);
        document.body.style.setProperty('--theme-accent', config.fallback.accent);
        document.body.style.setProperty('--theme-footer-bg', config.fallback.footer);
    }

    // 2. Logos (Active/Inactive)
    if (game === 'poe') {
        logoPoe.classList.remove('inactive');
        logoPoe2.classList.add('inactive');
    } else {
        logoPoe.classList.add('inactive');
        logoPoe2.classList.remove('inactive');
    }

    // 3. Launch Button URL
    launchBtn.dataset.url = config.url;

    // 4. Fix Guide Visibility
    if (config.showFixGuide) {
        fixGuideBtn.style.display = 'flex';
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
        saveSetting(STORAGE_KEYS.SELECTED_GAME, 'poe');
    }
});

logoPoe2.addEventListener('click', () => {
    if (selectedGame !== 'poe2') {
        updateGameUI('poe2');
        saveSetting(STORAGE_KEYS.SELECTED_GAME, 'poe2');
    }
});

// Save settings on change
closeTabToggle.addEventListener('change', () => {
    saveSetting(STORAGE_KEYS.CLOSE_TAB, closeTabToggle.checked);
});

closePopupToggle.addEventListener('change', () => {
    saveSetting(STORAGE_KEYS.CLOSE_POPUP, closePopupToggle.checked);
});

// Plugin Disable Toggle Logic
pluginDisableToggle.addEventListener('change', () => {
    const isDisabled = pluginDisableToggle.checked;
    saveSetting(STORAGE_KEYS.PLUGIN_DISABLED, isDisabled);
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

// Initialize Settings
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await loadSettings();

    closeTabToggle.checked = settings.closeTab;
    closePopupToggle.checked = settings.closePopup;

    const isDisabled = settings.isPluginDisabled;
    pluginDisableToggle.checked = isDisabled;
    updatePluginDisabledState(isDisabled);

    updateGameUI(settings.selectedGame);
});

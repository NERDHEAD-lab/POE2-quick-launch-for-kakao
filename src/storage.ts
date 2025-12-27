/**
 * Centralized Storage Management
 * Handles all chrome.storage.local interactions, types, and default values.
 */

export type GameType = 'poe' | 'poe2';

export interface AppSettings {
    autoStartEnabled: boolean; // Legacy key, kept for compatibility if needed
    closeTab: boolean;
    closePopup: boolean;
    isPluginDisabled: boolean;
    selectedGame: GameType;
}

export const STORAGE_KEYS = {
    AUTO_START: 'autoStartEnabled',
    CLOSE_TAB: 'closeTab',
    CLOSE_POPUP: 'closePopup',
    PLUGIN_DISABLED: 'isPluginDisabled',
    SELECTED_GAME: 'selectedGame'
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
    autoStartEnabled: false,
    closeTab: false,
    closePopup: false,
    isPluginDisabled: false,
    selectedGame: 'poe2'
};

/**
 * Loads all settings from storage, applying defaults for missing values.
 */
export async function loadSettings(): Promise<AppSettings> {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (result: { [key: string]: any }) => {
            const settings: AppSettings = {
                autoStartEnabled: (result[STORAGE_KEYS.AUTO_START] as boolean) ?? DEFAULT_SETTINGS.autoStartEnabled,
                closeTab: (result[STORAGE_KEYS.CLOSE_TAB] as boolean) ?? DEFAULT_SETTINGS.closeTab,
                closePopup: (result[STORAGE_KEYS.CLOSE_POPUP] as boolean) ?? DEFAULT_SETTINGS.closePopup,
                isPluginDisabled: (result[STORAGE_KEYS.PLUGIN_DISABLED] as boolean) ?? DEFAULT_SETTINGS.isPluginDisabled,
                selectedGame: (result[STORAGE_KEYS.SELECTED_GAME] as GameType) ?? DEFAULT_SETTINGS.selectedGame
            };
            resolve(settings);
        });
    });
}

/**
 * Saves a single setting to storage.
 */
export function saveSetting<K extends keyof AppSettings>(key: string, value: AppSettings[K]): void {
    chrome.storage.local.set({ [key]: value });
}

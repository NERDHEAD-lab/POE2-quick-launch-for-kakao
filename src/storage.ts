/**
 * Centralized Storage Management
 * Handles all chrome.storage.local interactions, types, and default values.
 */

export type GameType = 'poe' | 'poe2';

export interface AppSettings {
    closeTab: boolean;
    closePopup: boolean;
    pluginDisable: boolean;
    patchNoteCount: number; // 1~20
    lastPatchNoteRead: number; // Timestamp
    selectedGame: GameType;
}

export const STORAGE_KEYS = {
    CLOSE_TAB: 'closeTab',
    CLOSE_POPUP: 'closePopup',
    PLUGIN_DISABLED: 'pluginDisable', // Renamed key for consistency
    SELECTED_GAME: 'selectedGame',
    PATCH_NOTE_COUNT: 'patchNoteCount',
    LAST_PATCH_NOTE_READ: 'lastPatchNoteRead'
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
    closeTab: false,
    closePopup: false,
    pluginDisable: false,
    patchNoteCount: 3,
    lastPatchNoteRead: 0,
    selectedGame: 'poe2'
};

/**
 * Loads all settings from storage, applying defaults for missing values.
 */
export async function loadSettings(): Promise<AppSettings> {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (result: { [key: string]: any }) => {
            const settings: AppSettings = {
                closeTab: (result[STORAGE_KEYS.CLOSE_TAB] as boolean) ?? DEFAULT_SETTINGS.closeTab,
                closePopup: (result[STORAGE_KEYS.CLOSE_POPUP] as boolean) ?? DEFAULT_SETTINGS.closePopup,
                pluginDisable: (result[STORAGE_KEYS.PLUGIN_DISABLED] as boolean) ?? DEFAULT_SETTINGS.pluginDisable,
                patchNoteCount: (result[STORAGE_KEYS.PATCH_NOTE_COUNT] as number) ?? DEFAULT_SETTINGS.patchNoteCount,
                lastPatchNoteRead: (result[STORAGE_KEYS.LAST_PATCH_NOTE_READ] as number) ?? DEFAULT_SETTINGS.lastPatchNoteRead,
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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SETTINGS, type AppSettings } from '../src/storage';

vi.mock('../src/utils/context', () => ({ startContextHeartbeat: vi.fn() }));

describe('Kakao homepage automation', () => {
    let settings: AppSettings;
    let onDocumentClick: ReturnType<typeof vi.fn>;
    let onWindowEvent: ReturnType<typeof vi.spyOn>;
    let initializationErrors: ReturnType<typeof vi.spyOn>;
    let sendMessage: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.resetModules();
        vi.useFakeTimers();
        settings = { ...DEFAULT_SETTINGS };
        document.body.innerHTML = '';
        document.cookie = 'POE2_INTRO_MODAL=; path=/; max-age=0';
        vi.stubGlobal('location', new URL('https://pathofexile2.kakaogames.com/main#autoStart'));
        vi.spyOn(history, 'replaceState').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
        initializationErrors = vi.spyOn(console, 'error').mockImplementation(() => {});
        onWindowEvent = vi.spyOn(globalThis, 'addEventListener');
        onDocumentClick = vi.fn();
        document.addEventListener('click', onDocumentClick);
        sendMessage = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('chrome', {
            runtime: {
                id: 'test-extension',
                sendMessage,
                onMessage: { addListener: vi.fn() }
            },
            storage: {
                local: {
                    get: vi.fn((_keys: unknown, callback: (values: AppSettings) => void) =>
                        callback(settings)
                    )
                }
            }
        });
    });

    afterEach(() => {
        document.removeEventListener('click', onDocumentClick);
        for (const [type, listener] of onWindowEvent.mock.calls) {
            if (type === 'hashchange') globalThis.removeEventListener(type, listener);
        }
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        expect(initializationErrors).not.toHaveBeenCalled();
    });

    it('clicks the current GAME START button once and bubbles to page listeners', async () => {
        document.body.innerHTML = '<button class="btn_start"><span>GAME START</span></button>';
        const startButton = document.querySelector('button');

        await import('../src/content');
        await vi.advanceTimersByTimeAsync(12000);

        expect(onDocumentClick).toHaveBeenCalledTimes(1);
        expect(onDocumentClick.mock.calls[0][0].target).toBe(startButton);
        expect(sendMessage).toHaveBeenCalledWith({ action: 'registerMainTab' });
    });

    it('does not start a normal homepage visit without #autoStart', async () => {
        vi.stubGlobal('location', new URL('https://pathofexile2.kakaogames.com/main'));
        document.body.innerHTML = '<button class="btn_start">GAME START</button>';

        await import('../src/content');
        await vi.advanceTimersByTimeAsync(12000);

        expect(onDocumentClick).not.toHaveBeenCalled();
        expect(sendMessage).not.toHaveBeenCalledWith({ action: 'registerMainTab' });
    });

    it('preserves POE1 start clicks through the shared homepage polling', async () => {
        vi.stubGlobal('location', new URL('https://poe.kakaogames.com/#autoStart'));
        document.body.innerHTML =
            '<a id="signupButton" href="javascript:kgPoe.launch()">지금 무료로 플레이하기</a>';
        const startButton = document.getElementById('signupButton');

        await import('../src/content');
        await vi.advanceTimersByTimeAsync(12000);

        expect(onDocumentClick).toHaveBeenCalledTimes(1);
        expect(onDocumentClick.mock.calls[0][0].target).toBe(startButton);
        expect(sendMessage).toHaveBeenCalledWith({ action: 'registerMainTab' });
    });

    it('does not fall back to obsolete markup or unrelated Korean start labels', async () => {
        document.body.innerHTML = `
            <a class="main-start__link">Old start</a>
            <button>게임 시작</button>`;

        await import('../src/content');
        await vi.advanceTimersByTimeAsync(12000);

        expect(onDocumentClick).not.toHaveBeenCalled();
        expect(sendMessage).not.toHaveBeenCalledWith({ action: 'registerMainTab' });
    });

    it('uses the active intro today button even with an existing official cookie', async () => {
        settings.closePopup = true;
        vi.stubGlobal('location', new URL('https://pathofexile2.kakaogames.com/main'));
        document.cookie = 'POE2_INTRO_MODAL=1; path=/';
        const cookieWrite = vi.spyOn(document, 'cookie', 'set');
        document.body.innerHTML = `
            <div id="otherLayer"><button class="btn_today">Other popup</button></div>
            <div id="layerIntro" class="on">
                <button class="btn_today">오늘 하루 보지 않기</button>
                <button class="btn_close">닫기</button>
            </div>`;

        await import('../src/content');

        expect(onDocumentClick).toHaveBeenCalledTimes(1);
        expect(onDocumentClick.mock.calls[0][0].target).toBe(
            document.querySelector('#layerIntro .btn_today')
        );
        expect(cookieWrite).not.toHaveBeenCalled();
    });

    it('uses ordinary close during auto start when today dismissal is disabled', async () => {
        const cookieWrite = vi.spyOn(document, 'cookie', 'set');
        document.body.innerHTML = `
            <div id="layerIntro" class="on">
                <button class="btn_today">오늘 하루 보지 않기</button>
                <button class="btn_close">닫기</button>
            </div>`;

        await import('../src/content');

        expect(onDocumentClick).toHaveBeenCalledTimes(1);
        expect(onDocumentClick.mock.calls[0][0].target).toBe(
            document.querySelector('#layerIntro .btn_close')
        );
        expect(cookieWrite).not.toHaveBeenCalled();
    });

    it('waits for the intro to become active and leaves other layers untouched', async () => {
        settings.closePopup = true;
        vi.stubGlobal('location', new URL('https://pathofexile2.kakaogames.com/main'));
        document.body.innerHTML = `
            <div id="otherLayer" class="on"><button class="btn_today">Other popup</button></div>
            <div id="layerIntro"><button class="btn_today">오늘 하루 보지 않기</button></div>`;

        await import('../src/content');
        await vi.advanceTimersByTimeAsync(400);
        expect(onDocumentClick).not.toHaveBeenCalled();

        document.getElementById('layerIntro')!.classList.add('on');
        await vi.advanceTimersByTimeAsync(1000);

        expect(onDocumentClick).toHaveBeenCalledTimes(1);
        expect(onDocumentClick.mock.calls[0][0].target).toBe(
            document.querySelector('#layerIntro .btn_today')
        );
    });
});

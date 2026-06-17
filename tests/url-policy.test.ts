import { describe, expect, it } from 'vitest';

import { EXT_URLS } from '../src/constants';
import {
    isKakaoGamesMemberLoginUrl,
    isKnownKakaoReferrer,
    isLauncherUrl,
    isPoe2HomeUrl,
    isPoeHomeUrl,
    isSecurityCenterUrl,
    KAKAO_HOSTS
} from '../src/urlPolicy';

describe('Kakao URL policy', () => {
    it('uses current Kakao Games primary URLs', () => {
        expect(EXT_URLS.POE.HOMEPAGE).toBe('https://poe.kakaogames.com/');
        expect(EXT_URLS.POE2.HOMEPAGE).toBe('https://pathofexile2.kakaogames.com/main');
    });

    it('matches current and legacy homepage hosts', () => {
        expect(isPoeHomeUrl(new URL('https://poe.kakaogames.com/'))).toBe(true);
        expect(isPoeHomeUrl(new URL('https://pathofexile.kakaogames.com/'))).toBe(true);
        expect(isPoeHomeUrl(new URL('https://poe.game.daum.net/'))).toBe(true);

        expect(isPoe2HomeUrl(new URL('https://pathofexile2.kakaogames.com/'))).toBe(true);
        expect(isPoe2HomeUrl(new URL('https://pathofexile2.kakaogames.com/main'))).toBe(true);
        expect(isPoe2HomeUrl(new URL('https://pathofexile2.game.daum.net/main'))).toBe(true);
    });

    it('matches current launcher and security-center hosts', () => {
        expect(isLauncherUrl(new URL('https://pubsvc.kakaogames.com/gamestart/poe2.html'))).toBe(
            true
        );
        expect(isLauncherUrl(new URL('https://pubsvc.game.daum.net/gamestart/poe2.html'))).toBe(
            true
        );
        expect(isSecurityCenterUrl(new URL('https://security-center.kakaogames.com/'))).toBe(true);
        expect(isSecurityCenterUrl(new URL('https://security-center.game.daum.net/'))).toBe(true);
    });

    it('matches Kakao Games member login before OAuth code callback', () => {
        expect(isKakaoGamesMemberLoginUrl(new URL('https://member.kakaogames.com/login'))).toBe(
            true
        );
        expect(
            isKakaoGamesMemberLoginUrl(new URL('https://member.kakaogames.com/login?code=done'))
        ).toBe(false);
    });

    it('validates referrers by hostname', () => {
        expect(
            isKnownKakaoReferrer(
                'https://pubsvc.kakaogames.com/gamestart/poe2.html',
                KAKAO_HOSTS.launcher
            )
        ).toBe(true);
        expect(isKnownKakaoReferrer('', KAKAO_HOSTS.launcher)).toBe(false);
        expect(isKnownKakaoReferrer('https://example.com/', KAKAO_HOSTS.launcher)).toBe(false);
    });
});

export const KAKAO_HOSTS = {
    poeHome: ['poe.kakaogames.com', 'pathofexile.kakaogames.com', 'poe.game.daum.net'],
    poe2Home: ['pathofexile2.kakaogames.com', 'pathofexile2.game.daum.net'],
    launcher: ['pubsvc.kakaogames.com', 'pubsvc.game.daum.net'],
    securityCenter: ['security-center.kakaogames.com', 'security-center.game.daum.net'],
    member: ['member.kakaogames.com'],
    daumLogin: ['logins.daum.net'],
    kakaoAuth: ['kauth.kakao.com'],
    kakaoAccount: ['accounts.kakao.com']
} as const;

export function isPoeHomeUrl(url: URL): boolean {
    return includesHost(KAKAO_HOSTS.poeHome, url.hostname);
}

export function isPoe2HomeUrl(url: URL): boolean {
    return includesHost(KAKAO_HOSTS.poe2Home, url.hostname);
}

export function isLauncherUrl(url: URL): boolean {
    return includesHost(KAKAO_HOSTS.launcher, url.hostname);
}

export function isSecurityCenterUrl(url: URL): boolean {
    return includesHost(KAKAO_HOSTS.securityCenter, url.hostname);
}

export function isDaumLoginUrl(url: URL): boolean {
    return includesHost(KAKAO_HOSTS.daumLogin, url.hostname);
}

export function isKakaoGamesMemberLoginUrl(url: URL): boolean {
    return (
        includesHost(KAKAO_HOSTS.member, url.hostname) &&
        url.pathname.replace(/\/+$/, '') === '/login' &&
        !url.searchParams.has('code')
    );
}

export function isKakaoAuthUrl(url: URL): boolean {
    return includesHost(KAKAO_HOSTS.kakaoAuth, url.hostname);
}

export function isKnownKakaoReferrer(referrer: string, allowedHosts: readonly string[]): boolean {
    if (!referrer) return false;

    try {
        return allowedHosts.includes(new URL(referrer).hostname);
    } catch {
        return allowedHosts.some((host) => referrer.includes(host));
    }
}

function includesHost(hosts: readonly string[], hostname: string): boolean {
    return hosts.includes(hostname);
}

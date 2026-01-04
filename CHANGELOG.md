# Changelog

## [1.2.0](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/compare/1.1.0...1.2.0) (2026-01-04)


### Features

* 1회성 팝업 차단 / daumgameStart 실행 확인 등을 위한 방어 코드 추가 및 코드 정리 ([afa9f71](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/afa9f71a38ccc110f0e5d51f22fa02a005e1edb9))
* notice UI를 메뉴에 통합 ([9781783](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/97817834d003a21771e3b7a526548e6313732e4c))
* 메뉴 UI 개선 ([15cc97e](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/15cc97e33d250fc03a2148c60349ba5bbadbc4d2))
* 설정값 "자동실행 후 탭 닫기"가 마지막 게임 시작 팝업을 확인 누른 후 탭을 닫도록 동작 개선 ([a88f874](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/a88f874e64c0895a55464cf9db3d098d3c7f6154))
* 오류 수정 후 자동으로 게임을 시작하는 기능 추가 - 2 ([3dfa6ae](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/3dfa6aef0181d6b9d82852c21fbe7e64e0ca17a7))
* 오류 수정 후 자동으로 게임을 시작하는 기능 추가 ( POE2 카카오게임즈 클라이언트 오류 해결 마법사 연동 ) ([665e81e](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/665e81eee8852bee63714db3f4b6ca1f04d709fe))
* 일부 환경에서 CSP 정책에 따라 게임 시작 버튼 클릭 이벤트가 차단 될 수 있는 문제 수정 ([03f0bf4](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/03f0bf4bf31e47b2edf3575d039e8c27bc4bcc9e))
* 특정 브라우저에서 만 표시되는 도움말을 위한 인터페이스 변경 ([091608c](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/091608c2498947611b40070df12f5d5e5e170872))
* 파이어폭스 동작 개선 ([0d6210e](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/0d6210eb1fb2af6e1be1bf80c275a856125ba7dc))
* 파이어폭스 빌드가 release에 포함되도록 수정 ([794c060](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/794c060838ca3df263ff334577b96ac7834ac202))
* 파이어폭스 지원 추가 ([f1c7852](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/f1c7852175f2a4325305cebbcd3e50d61da34238))


### Bug Fixes

* Brave 브라우저에서 발생하던 `ReferenceError` (호이스팅 문제) 수정 (초기화 로직 위치 변경) ([3977219](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/3977219a067c3cf6d8de46eb9c223ce2864345b5))
* **CI/CD:** vite dev 환경 개선 ([5c33923](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/5c33923e5f106d3ead88e7823846705347d0aaba))
* **CI/CD:** vite dev 환경 정상화 ([37791b2](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/37791b2e87f1e8e77c5bf41c9cda29993fe6910e))
* 간헐적으로 패치노트가 갱신 되지 않는 문제 수정 ( 최대 3회 재시도 ) ([9e92b20](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/9e92b205ca08eef549de849de7896ebdf4fbdb02))
* 불필요한 세션 권한 제거 ([2bf99d8](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/2bf99d8343ee187e24918d78bd83e756b7d2c38a))
* 툴팁이 정상적으로 표시되지 않는 문제 수정 ([8d7e9f4](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/8d7e9f49bbbb7f95c49a526ab7dbc809241802d4))
* 홈페이지 이벤트 창이 이미 닫겨있지만 불필요하게 닫으려고 시도하는 문제 수정 ([300d40e](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/300d40e328d86e66d337cf0db678ca79710840ed))

## [1.1.0](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/compare/1.0.1...1.1.0) (2025-12-29)

### Features

- popup에서 poe와 poe2 전환 간 패치노트 표시 성능 개선 및 최적화 ([671e8c5](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/671e8c5dfcd4675fab8095cdb5cc8c11ef5769ee))
- popup의 공지 표시 기능 개선 및 설정에서 숨기기 옵션 추가 ([fbb2b76](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/fbb2b768b797e28658198da3db2193a4164e98d9))
- poup에서 poe/poe2 배경화면에 따른 동적 테마 색상 적용 성능 최적화 ([ccb8257](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/ccb82579e5cc4204554c31a157ea05712b4b67a6))

### Bug Fixes

- 설정 명칭 구체화 ('항상 팝업 닫기' -&gt; '홈페이지 이벤트 창 자동 닫기' 등) ([8013793](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/8013793a6ad5a9981c521f3fb46423735abb78c6))

## [1.0.1](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/compare/1.0.0...1.0.1) (2025-12-28)

### Bug Fixes

- 플러그인 이름 및 릴리즈 규칙 수정 ([cd0ab38](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/cd0ab383cb5690724c38860a2ffde680a11d51ed))

## [1.0.0](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/compare/1.0.0...1.0.0) (2025-12-28)

### Features

- manifest 권한 최적화 ([be3475e](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/be3475ee4ef9f0dadfc0f42dcc253bdc8965c530))
- poe &lt;-&gt; poe2 전환 기능 추가 ([d093a9e](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/d093a9ea0bbc008d76c38350831d68a2a065c085))
- poe &lt;-&gt; poe2 전환 기능 추가 - 2 ([5fd7c06](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/5fd7c06226158d23b783fcfbddc02d0a641cfa27))
- poe &lt;-&gt; poe2 전환 기능 추가 - 3 ([970b4a4](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/970b4a49f0a19535b3ce834eadc7ecf51cb622a8))
- popup 동적 색상 적용 ([89f90a0](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/89f90a0731a21feef185be1dfe9015dd6c7ef1e7))
- popup 로고 클릭시 홈페이지 이동 추가 ([af2ae66](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/af2ae66f1374b95d155adaefd6587dc0c1d5b04e))
- popup 하단에 github 링크 추가 ([521e0d7](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/521e0d7925c2d258bcbd8766260ac7058d016736))
- popup에 "POE2 카카오 업데이트 오류 자동 수정 도구" 링크 추가 ([caacf44](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/caacf44d34bc250b1dc05831c376af91decdefe7))
- popup에 패치노트 동작 최적화 ([6f705ee](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/6f705ee9b8d8dd2be18302d470ccad164fe1ec72))
- popup에 패치노트 추가 ([1854466](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/1854466d90c64b85f814874d82b5786ad594e248))
- pupop 스타일 개선 ([3335f03](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/3335f0317f20d970a51a93198cc6e31da4c9db07))
- pupop 스타일 개선 - 2 ([7ade353](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/7ade3539d9567990a675041826a25b3076812a89))
- pupop 스타일 개선 - 3 ([de8538d](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/de8538d9d314753bdb7e4f646c0af8341d0ba40d))
- pupop 스타일 개선 - 4 ([8418a21](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/8418a213ec10b57f3244250132d5db9d100bf735))
- storage 관련 코드 통합 및 기본값 관련 문제 수정 ([a0deafa](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/a0deafa1be5bb2bc230782a8a08117783548cdfe))
- update package.json (빌드 프로세스 보강) ([7d4bdb5](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/7d4bdb5e129c906c8c456ec2744d4fcbf881b3dc))
- 게임 시작 속도 개선 ([6396f82](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/6396f82fbff6f248d6a2edc502d565c89168fb55))
- 게임 실행 후 탭 닫기 기능 구현 ([58f82bc](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/58f82bca35316dc60f9b79ea4f57cd0d16ab6e52))
- 기본 기능 구현 ([631b43f](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/631b43fcfbaf0d97f1232c8f24e232e5e0cd780c))
- 드래그 방지 추가 ([d0a5fbd](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/d0a5fbd24d71ef4a94fae33aaacb8f8a33a30858))
- 문의 버튼 추가 ([c81017f](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/c81017f3fdd9ff2fe479ee9122c49af4727bb0dc))
- 불필요한 manifest.json 권한 정리 ([68c9e71](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/68c9e714e9e5d2ff5d44fef82a75e33f294df484))
- 일부 로직 정상화 ([4309993](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/43099936ff223f54d582bc3b9c477f6e677f3692))
- 자동 탭 닫기 기능 구현 ([4553f9f](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/4553f9f0e151177b2c6182ccbb6f85ddfc4d850a))
- 코드 정리 ([9604c68](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/9604c68ae1947b7184c10da6f05f28ae74f4f0a6))
- 플러그인 비활성화 버튼 추가 ([a17f42a](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/a17f42a5457fc39bf9c0e21d2f30b034b6a8bc18))
- 항상 팝업 닫기 툴팁 추가 ([d6ecb34](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/d6ecb3400e030ef2f6aa281b6201bff0477285b2))
- 홈페이지/거래소 바로가기 추가 ([81ef667](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/81ef667de40274e133bc88077673a1dfb0ab78b6))
- 후원하기 추가 ([71a5b42](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/71a5b428d388eda4cc0490823aafa3090d9bfa54))

### Bug Fixes

- Edge Browser 호환성 문제 수정 ([c27b0f7](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/c27b0f7f7dc305ea7f4a7682b271ae007d1c21ca))
- popup에서 설정관련 문제 일괄 수정 ([7958697](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/79586974b5520f35a69de1e8048ca13a4dfad450))
- 다른 팝업들을 실수로 닫는 문제 수정 ([80e137f](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/80e137fde8cfaa38bb731edd6558c090fa46a6c5))
- 다른 팝업들을 실수로 닫는 문제 수정 - 2 ([fc51407](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/fc5140766581d5bd27698ae8af4c67d10d662d53))
- 플러그인 비활성화 시 홈페이지/거래소도 비활성화되는 문제 수정 ([487e749](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/487e749c833e3482f802592f6d4a1e9f9e280942))

### Chores

- release 1.0.0 ([971bd8d](https://github.com/NERDHEAD-lab/POE2-quick-launch-for-kakao/commit/971bd8d70f43e560d056a4f49ecdfba1b69c971d))

# RAIO Frontend Storyboard

## 목표
아프리카TV형 실시간 스트리밍 사이트를 기준으로 홈 탐색, 방송 상세, 채팅, 후원, 포인트 충전, 로그인/회원가입 전환을 하나의 사용자 흐름으로 정리한다.

## 1. 홈
- 상단 GNB: 로고, 방송/스트리머 검색, 방송 만들기 CTA, 포인트, 사용자 메뉴
- 카테고리 바: 전체/게임/먹방/소통/음악/공부/스포츠/창작
- 히어로 영역: 서비스 정체성 및 핵심 행동 강조
- 라이브 카드 그리드: 썸네일, LIVE 배지, 시청자 수, 제목, 스트리머, 태그

## 2. 인증
- 로그인: email/password 입력, 성공 시 홈으로 이동
- 회원가입: email/password/nickname/phoneNumber 입력
- Users 도메인 반영 필드: id, email, password, nickname, phoneNumber, role, status, lastLoginAt
- 개발 환경에서는 백엔드 미연결 시 mock 인증으로 동작하고, 운영 환경에서는 API 실패를 노출한다.

## 3. 방송 상세
- 상단: 홈 브레드크럼, 스트리머명
- 좌측: 라이브 플레이어, 스트림 정보, 팔로우, 공지, 후원 박스
- 우측: 실시간 채팅 패널 고정
- 모바일/작은 화면: 채팅 패널은 숨기고 핵심 시청 영역 우선

## 4. 채팅
- STOMP `/sub/chat/{streamId}`, `/pub/chat/{streamId}` 기준
- 후원 알림은 `/sub/donation/{streamId}` 기준
- 서버 미연결 시 mock 메시지로 UI 확인 가능

## 5. 후원/포인트
- 방송 상세에서 금액 선택 후 메시지와 함께 후원
- 포인트 부족 시 충전 모달 오픈
- 충전 모달은 mock 충전으로 선반영, 이후 결제 API로 교체 가능

## FSD 구조
- app: 앱 부트스트랩, 라우터
- pages: 라우트 단위 화면
- widgets: 화면의 큰 조립 단위
- features: 사용자 행동 단위 기능
- entities: 핵심 도메인 모델과 UI
- shared: 공통 API, 포맷터, 토스트, 유틸

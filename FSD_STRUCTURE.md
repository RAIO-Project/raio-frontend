# FSD 구조 정리

이 프로젝트는 TypeScript + React + Vite 기반이며, 도메인은 `user`, `stream`, `chat`, `donation`을 기준으로 나눴습니다.

## 레이어

- `app`: 앱 엔트리와 라우터
- `pages`: 라우트 단위 페이지
- `widgets`: 페이지를 구성하는 큰 UI 블록
- `features`: 사용자가 수행하는 기능 단위
- `entities`: 비즈니스 도메인 모델과 도메인 UI
- `shared`: 공통 API, lib, UI, 타입 보강

## 도메인 기준

- `entities/user`: 사용자 타입, 역할, 상태, 세션 DTO
- `features/user`: 로그인/회원가입/mock session store
- `entities/stream`: 방송 타입, mock 데이터, 필터 순수 함수, 방송 카드
- `features/stream-filter`: 방송 카테고리 필터
- `entities/chat`: 채팅 메시지 타입
- `features/chat`: STOMP/SockJS 연결, 채팅 패널
- `entities/donation`: 후원 payload 타입
- `features/donation`: 포인트 후원 UI

## Import 규칙

상위 레이어는 하위 레이어의 public API만 사용합니다.

```ts
import { useUserStore } from '@/features/user'
import { StreamCard, useStreamStore } from '@/entities/stream'
```

내부 경로 직접 접근은 같은 slice 내부에서만 허용합니다.

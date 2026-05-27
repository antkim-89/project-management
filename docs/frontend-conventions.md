# Frontend Code Conventions

프론트엔드(React + Vite + Tailwind CSS) 개발 시 준수해야 할 규칙입니다.

## 1. 컴포넌트 작성 (React)

- **함수형 컴포넌트**를 기본으로 사용합니다.
- **Props 타입 정의**: Interface 또는 Type을 컴포넌트 상단에 정의합니다.
- **컴포넌트 구조**:
  1. Imports
  2. Types/Interfaces
  3. Constants
  4. Helper Functions (컴포넌트 외부)
  5. Main Component

```tsx
import React from 'react';

interface Props {
  title: string;
}

export const MyComponent: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};
```

## 2. 상태 관리 (Zustand)

- 스토어는 `src/store` 디렉토리에 위치합니다.
- 도메인 단위로 스토어를 분리합니다 (예: `useAuthStore`, `useProjectStore`).
- 불변성을 유지하며 상태를 업데이트합니다.

## 3. 스타일링 (Tailwind CSS)

- 가능하면 인라인 클래스보다 가독성을 위해 적절히 줄바꿈을 사용합니다.
- 복잡한 조건부 클래스는 `clsx` 또는 `tailwind-merge` 라이브러리를 활용합니다.
- 재사용 가능한 스타일은 `GlassCard.tsx`와 같은 공통 컴포넌트로 추상화합니다.

## 4. 라우팅 (TanStack Router)

- 파일 기반 라우팅을 준수합니다.
- 라우트 관련 로직(Loader, Search Params)은 해당 라우트 파일 내에 작성합니다.

## 5. 비동기 데이터 처리

- API 호출은 `src/lib/api` 또는 `src/hooks`에 정의하여 재사용합니다.
- 에러 처리는 공통 에러 경계(Error Boundary) 또는 Toast 메시지를 활용합니다.




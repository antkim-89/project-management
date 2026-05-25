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

---

## 6. 공통 컴포넌트 및 디자인 시스템 규칙

### 1) 공통 버튼 (`Button`) 컴포넌트
- 아이콘을 버튼 내부에 배치할 때는 자식(children) 요소로 하드코딩해서 넣지 않고, `prefixIcon` 및 `suffixIcon` 속성을 사용하여 텍스트 바깥으로 격리되게 정렬합니다.
- 아이콘만 들어가는 단독 버튼(예: 모달 닫기 등)의 경우 `children`을 비워 `gap`에 의한 비대칭 여백을 없애고 정확히 수평/수직 정중앙 정렬이 적용되도록 처리합니다.

### 2) 글로벌 z-index 레이아웃 가이드라인
쌓임 맥락(Stacking Context)의 꼬임과 영역 가림 현상을 방지하기 위해 다음 표준 레이어를 반드시 준수합니다.

| 레이어 이름 | z-index 정의 | 설명 |
| :--- | :--- | :--- |
| **Sticky Header** | `z-[10]` | 타임라인, 리스트 헤더 등 페이지 내부의 고정 헤더 |
| **Global Sidebar** | `z-[20]` | 메인 레이아웃의 좌측 사이드바 |
| **Global Header** | `z-[30]` | 메인 레이아웃의 상단 헤더 |
| **Select Dropdown** | `z-[40]` | 드롭다운 선택 메뉴 |
| **Popover** | `z-[45]` | 설명 툴팁 및 팝오버 |
| **Calendar Picker** | `z-[50]` | 단독 또는 입력 폼 내의 달력 팝업 |
| **Base Modal** | `z-[100]` | 팝업 모달 백드롭 및 컨테이너 |

- **주의 사항**: 모달 내부 영역에서는 달력 피커 등이 상위 폼 레이아웃 뒤로 숨는 버그를 예방하기 위해, 불필요한 인라인 z-index(예: `z-50`, `z-40` 등)를 지정하는 대신 공통 z-index 가이드를 상속하도록 모달 구조를 깨끗하게 설계합니다.

### 3) 캘린더 범위 선택 (`CalendarPicker`)
- 기간을 설정해야 하는 경우 `mode="range"` 속성을 주입하여 단일 날짜 선택 모드 대신 시작일과 종료일 범위를 선택할 수 있도록 구현합니다.
- 범위로 선택된 일자는 반투명 액티브 컬러(`bg-primary/15`)로 중간을 연결하며, 시작 지점과 끝 지점은 둥글게 하이라이트됩니다.


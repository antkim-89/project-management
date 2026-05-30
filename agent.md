# AI 에이전트 지침서 (Agent Guidelines)

본 문서는 본 프로젝트에서 작업을 수행하는 **AI 코딩 에이전트 및 자동화 도구**를 위한 개발 가이드라인입니다. 새로운 기능을 개발하거나 기존 코드를 리팩토링할 때, 이 문서에 기재된 규칙들을 반드시 준수해야 합니다.

---

## 📅 1. 프로젝트 개요 & 아키텍처

본 프로젝트는 프론트엔드와 백엔드가 분리된 **모노레포(Monorepo) 구조**의 엔터프라이즈급 프로젝트 및 리소스 관리 시스템입니다.

### 1.1 프로젝트 디렉토리 구조
- **`front-end/`**: React 18 & Vite 기반의 대시보드 UI 클라이언트.
- **`back-end/`**: Node.js & Express & TypeScript 기반의 API 서버.
- **`db/`**: 데이터베이스 스키마 및 마이그레이션 파일.
- **`docs/`**: 기획 및 설계 세부 명세서.
  - **`docs/specs/`**: 시스템 사양, 설계, API, ERD, 디자인 규격 문서.
  - **`docs/guides/`**: 환경 설정 및 영역별 코딩 컨벤션 가이드 문서.

### 1.2 기술 스택 (Tech Stack)
- **Frontend**: React 18, TanStack Router, Zustand, Tailwind CSS v4, Chart.js / react-chartjs-2, Lucide React, i18next
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: MySQL / MariaDB

---

## 🎨 2. UI/UX 디자인 가드레일 (CRITICAL)

프론트엔드 UI 컴포넌트를 개발하거나 스타일링을 적용할 때 다음 디자인 사양을 엄격히 따라야 합니다.

### 2.1 다크 모드 전용 (Dark-only)
- **절대로 라이트 모드(Light mode)를 구현하지 마십시오.** 이 플랫폼은 오직 다크 모드 테마로만 작동합니다.
- 배경색은 주로 **Canvas (`#0A0A0A`)**를 사용하고, 계층 구분을 위해 **Surface 1 (`#161616`)**과 **Surface 2 (`#222222`)**를 카드나 컨테이너 표면에 적용하십시오.

### 2.2 강조 색상 (Accent Blue) 제한
- **Sky Blue (`#0099FF`)**는 하이퍼링크, 포커스 인풋 링(focus-input rings), 선택 아우라(selection halos)에만 사용해야 합니다.
- **절대로 넓은 영역을 채우는 면(fill) 색상으로 Accent Blue를 사용하지 마십시오.**

### 2.3 레이어 스태킹 (z-index) 규칙
컴포넌트 겹침 현상과 렌더링 오류를 막기 위해 인라인 하드코딩된 z-index(예: `z-50`)의 사용을 금지하며, 반드시 아래 정의된 레이어 스택을 적용해야 합니다.

| 레이어 토큰 | z-index 값 | 사용 예시 |
| :--- | :--- | :--- |
| **Sticky Header** | `z-[10]` | 테이블/타임라인의 열 헤더 고정 |
| **Global Sidebar** | `z-[20]` | 고정형 메인 사이드바 |
| **Global Header** | `z-[30]` | 고정형 상단 헤더 |
| **Select Dropdown** | `z-[40]` | 커스텀 Select 드롭다운 옵션 |
| **Popover** | `z-[45]` | 툴팁 및 안내 레이어 |
| **Calendar Picker** | `z-[50]` | 날짜/기간 선택 캘린더 팝업 |
| **Base Modal** | `z-[100]` | 모달 팝업 및 어두운 배경(Backdrop) |

---

## ⚙️ 3. 개발 규칙 및 컨벤션

### 3.1 명명 규칙 (Naming Conventions)
- **컴포넌트 및 파일명**: React 컴포넌트는 `PascalCase`를 사용하고, 유틸 함수나 설정 파일 등은 `kebab-case` 또는 `camelCase`를 지향합니다.
- **Prisma 모델 및 DB**: 테이블 명은 대문자와 언더바(`UPPER_SNAKE_CASE`)를 사용합니다 (예: `USER`, `LEAVE_REQUEST`).

### 3.2 프론트엔드 준수 사항
- 상태 관리는 Zustand를 사용하여 간결하고 직관적으로 전역 상태를 제어하며, 불필요한 상태의 전역화를 피하십시오.
- Tailwind CSS v4를 적극 활용하되, 미세 마이크로 애니메이션과 호버 효과를 적용하여 Premium 느낌의 UX를 구현하십시오.
- 버튼 UI는 Primary와 Secondary로 통일하고, 둥글기 강도는 캡슐 모양인 `{rounded.pill}`을 기본으로 사용하십시오.

### 3.3 백엔드 준수 사항
- 모든 API 코드는 TypeScript로 정적 타입을 정의하십시오.
- Prisma ORM을 이용하여 쿼리를 처리하며, 관계형 데이터를 가져올 때 적절히 `include` 구문을 활용해 쿼리 효율을 확보하십시오.
- API 에러 발생 시 일관된 에러 핸들링 미들웨어를 거치도록 설계하십시오.

---

## 📊 4. 데이터 모델 핵심 요약

Prisma 스키마 및 DB 모델링 설계 시 아래 핵심 엔티티 간의 관계를 숙지해야 합니다.

- **`USER` ➡️ `RANK`**: 사용자는 1개의 직급(단가 정보)을 가집니다.
- **`USER` ➡️ `ASSIGNMENT`**: 사용자는 복수의 프로젝트에 배정될 수 있으며 기여도(`contributionPercentage`)를 가집니다.
- **`USER` ➡️ `EQUIPMENT`**: 사용자는 업무용 장비를 할당받아 소유할 수 있습니다.
- **`USER` ➡️ `LEAVE_REQUEST`**: 사용자는 휴가를 신청하고 결재를 요청할 수 있습니다.
- **`PROJECT` ➡️ `ASSIGNMENT`**: 프로젝트는 여러 인력 배정 내역을 가집니다.
- **`PROJECT` ➡️ `PROJECT_SKILL` ➡️ `SKILL_SET`**: 프로젝트에 필요한 요구 기술 매핑을 관리합니다.
- **`EQUIPMENT` ➡️ `EQUIPMENT_SETTING`**: 장비 유형별 유효 수명을 조회하여 장비의 실시간 건강도(`health`)를 동적으로 계산합니다.

---

## 🔗 5. 관련 문서 맵핑 (Reference Maps)

보다 구체적인 상세 명세 및 규칙을 확인하려면 다음 문서들을 참조하십시오:

- **시스템 종합 요약**: [프로그램 통합 스펙 (Program Specification)](./docs/specs/program-spec.md)
- **인프라 및 실행**: [시작하기 (Getting Started)](./docs/guides/getting-started.md)
- **개발 컨벤션**: [프론트엔드 컨벤션](./docs/guides/frontend-conventions.md) | [백엔드 컨벤션](./docs/guides/backend-conventions.md)
- **디자인 규격서**: [디자인 시스템 가이드](./docs/specs/design.md)
- **데이터베이스 및 API**: [데이터베이스 ERD](./docs/specs/database-erd.md) | [주요 API 엔드포인트](./docs/specs/api-endpoints.md)

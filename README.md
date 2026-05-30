# Project Management System

현대적이고 직관적인 인터페이스를 갖춘 엔터프라이즈급 프로젝트 및 리소스 관리 시스템입니다.

---

## 📚 문서 (Documentation)

프로젝트 개발을 위한 규칙 및 가이드, 설계 문서입니다.

### 📋 프로그램 통합 스펙
- **[프로그램 통합 스펙 (Program Specification)](./docs/specs/program-spec.md)**: 시스템 전체 기능 요약, 시스템 아키텍처 및 디자인 사양

### 🚀 설치 및 시작
- **[시작하기 (Getting Started)](./docs/guides/getting-started.md)**: 패키지 설치, DB 세팅, 실행 방법 및 VS Code 설정
- **[기술 스택 (Tech Stack)](./docs/specs/tech-stack.md)**: 프론트엔드 및 백엔드 주요 기술 사양

### ⚙️ 개발 규칙 및 가이드
- **[코드 컨벤션 (Frontend)](./docs/guides/frontend-conventions.md)**: React, Zustand, Tailwind 설정 및 가이드
- **[코드 컨벤션 (Backend)](./docs/guides/backend-conventions.md)**: 아키텍처 구조, 에러 핸들링, API 설계 가이드
- **[명명 규칙 (Naming Conventions)](./docs/guides/naming-conventions.md)**: 파일, 디렉토리 및 소스 코드 표기법 규칙

### 📊 데이터베이스 및 API
- **[데이터베이스 ERD](./docs/specs/database-erd.md)**: 테이블 간 관계도 및 엔티티 상세 정보
- **[주요 API 엔드포인트](./docs/specs/api-endpoints.md)**: 백엔드 주요 API 목록

---

## 🏗️ 프로젝트 구조

프로젝트는 프론트엔드와 백엔드가 분리된 모노레포 구조로 설계되었습니다. 소스 코드 및 파일의 통일성을 위해 **[명명 규칙 (Naming Conventions)](./docs/guides/naming-conventions.md)**을 준수합니다.

- **`front-end/`**: React 기반의 프리미엄 대시보드 UI (개발 규칙은 **[프론트엔드 코드 컨벤션](./docs/guides/frontend-conventions.md)** 참고)
- **`back-end/`**: Express 및 Prisma 기반의 API 서버 (개발 규칙은 **[백엔드 코드 컨벤션](./docs/guides/backend-conventions.md)** 참고)

---

## 🚀 주요 기능

### 1. 프로젝트 포트폴리오 관리
- 진행 중인 프로젝트의 실시간 상태(Active, At Risk, Completed) 모니터링
- 예산 집행율(Burn Rate) 및 인력 투입 현황 관리
- 프로젝트별 마일스톤 및 활동 내역 추적

### 2. 인력 및 팀 관리 (Resource Management)
- 전 직원의 기술 스택(Skill Set) 및 숙련도 관리
- 거주 지역 및 직급별 단가 기반의 리소스 최적화
- 장비(노트북 등) 할당 및 관리 상태 추적

### 3. 캘린더 및 휴가 관리
- 프로젝트 타임라인 시각화 (Gantt Chart 스타일)
- 전사 인원 휴가 일정 및 부재 상황 통합 관리
- 휴가 신청 및 결재 프로세스 연동

### 4. 대시보드 및 인사이트
- 핵심 성과 지표(KPI) 실시간 시각화
- 인력 가동률 및 비용 효율성 차트 제공

---

## 🛠️ 기술 스택 (Tech Stack)

프로젝트는 현대적이고 확장성 높은 기술 스택을 기반으로 합니다. 자세한 전체 패키지 사양은 **[기술 스택 상세 문서](./docs/specs/tech-stack.md)**를 참고하세요.

- **Frontend**: React 18, TanStack Router, Zustand, Tailwind CSS v4
- **Backend**: Node.js (TypeScript), Express, Prisma ORM, MySQL / MariaDB

---

## 💻 시작하기

본 프로젝트는 **pnpm**을 패키지 매니저로 사용하며, `corepack`을 통해 관리됩니다.

초기 환경 설정, 의존성 설치, DB 동기화 및 실행에 대한 전체 프로세스는 **[시작하기 가이드 문서](./docs/guides/getting-started.md)**에 상세히 설명되어 있습니다.

---

## 🔗 주요 API 엔드포인트 (Backend)

기본 베이스 URL은 `http://localhost:4000`입니다. 전체 API 스펙과 헬스체크 사양은 **[주요 API 엔드포인트 문서](./docs/specs/api-endpoints.md)**에서 확인하실 수 있습니다.

---

## 📁 데이터베이스 구조

시스템은 사용자(USER), 직급(RANK), 투입 인력(ASSIGNMENT), 장비 관리(EQUIPMENT), 근태 및 휴가(LEAVE_REQUEST), 기술 정보(SKILL_SET, USER_SKILL) 등 8개의 주요 엔티티로 이루어져 있습니다.

상세 모델 속성 및 필드 간의 릴레이션 관계는 **[데이터베이스 ERD](./docs/specs/database-erd.md)** 문서를 참고하세요.

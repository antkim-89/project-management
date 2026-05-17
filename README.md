# Project Management System

현대적이고 직관적인 인터페이스를 갖춘 엔터프라이즈급 프로젝트 및 리소스 관리 시스템입니다.

---

## 📚 문서 (Documentation)

프로젝트 개발을 위한 규칙과 설계 문서입니다.

- **[코드 컨벤션 (Frontend)](./docs/frontend-conventions.md)**
- **[코드 컨벤션 (Backend)](./docs/backend-conventions.md)**
- **[명명 규칙 (Naming Conventions)](./docs/naming-conventions.md)**
- **[데이터베이스 ERD](./docs/database-erd.md)**

---

## 🏗️ 프로젝트 구조

프로젝트는 프론트엔드와 백엔드가 분리된 모노레포 구조로 설계되었습니다.

- **`front-end/`**: React 기반의 프리미엄 대시보드 UI
- **`back-end/`**: Express 및 Prisma 기반의 API 서버

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

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4 (Glassmorphism 디자인)
- **Icons**: Lucide React
- **Internationalization**: i18next

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **ORM**: Prisma
- **Database**: MySQL / MariaDB

---

## 💻 시작하기

본 프로젝트는 **pnpm**을 패키지 매니저로 사용합니다.

### 1. 환경 설정 (Corepack)

이 프로젝트는 `corepack`을 통해 pnpm 버전을 관리합니다. 설치 전 아래 설정을 먼저 진행해 주세요.

#### Windows (관리자 권한 PowerShell)
```powershell
corepack enable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### macOS / Linux (터미널)
```bash
corepack enable
```

### 2. 패키지 설치 및 DB 설정

최상위 루트에서 다음 명령어를 실행합니다:

```bash
# 1. 패키지 설치
pnpm install

# 2. Prisma 클라이언트 생성 및 DB 테이블 생성
pnpm run prisma generate
pnpm run prisma db push

# 3. 초기 데이터(Seed) 삽입
pnpm run prisma db seed
```

> **주의**: 실행 전 `back-end/.env` 파일의 `DATABASE_URL`이 본인의 MySQL 설정과 맞는지 확인해 주세요.

### 3. 프로젝트 실행

```bash
# 프론트엔드만 실행
pnpm run front dev

# 백엔드만 실행
pnpm run back dev

# 전체 동시 실행 (추천)
pnpm dev
```

---

## 🛠️ VS Code 설정

프로젝트를 열었을 때 우측 하단에 나타나는 **"Allow Workspace SDK"** 팝업을 허용하고, TypeScript 버전을 **Workspace Version**으로 선택해 주세요 (`Ctrl+Shift+P` -> `Select TypeScript Version`).

---

## 🔗 주요 API 엔드포인트 (Backend)

기본 베이스 URL: `http://localhost:4000`

- **프로젝트 (Projects)**
  - `GET /projects`: 전체 프로젝트 목록 조회 (참여 인원 포함)
  - `GET /projects/:id`: 특정 프로젝트 상세 조회
  - `POST /projects`: 새 프로젝트 생성
  - `PUT /projects/:id`: 프로젝트 정보 수정
  - `DELETE /projects/:id`: 프로젝트 삭제
- **헬스체크**
  - `GET /health`: 서버 상태 확인

---

## 📁 데이터베이스 구조

시스템은 다음의 핵심 엔티티를 포함하고 있습니다:
- **USER / RANK**: 사용자 및 직급 체계
- **PROJECT / ASSIGNMENT**: 프로젝트 및 인력 투입
- **EQUIPMENT**: 자산 관리
- **LEAVE_REQUEST**: 근태 및 휴가
- **SKILL_SET / USER_SKILL**: 기술 스택 및 숙련도 데이터

상세한 관계도는 **[데이터베이스 ERD](./docs/database-erd.md)** 문서를 참고하세요.

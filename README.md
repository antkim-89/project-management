# Project Management System

현대적이고 직관적인 인터페이스를 갖춘 엔터프라이즈급 프로젝트 및 리소스 관리 시스템입니다.

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

본 프로젝트는 **Yarn Berry (PnP)**를 패키지 매니저로 사용합니다. `node_modules` 대신 `.pnp.cjs`를 통한 효율적인 의존성 관리를 제공합니다.

### 1. 패키지 설치
최상위 루트에서 다음 명령어를 실행합니다:
```bash
yarn install
```

### 2. 프론트엔드 실행
```bash
yarn front dev
# 또는
yarn workspace front-end dev
```

### 3. 백엔드 실행
```bash
yarn back dev
# 또는
yarn workspace back-end dev
```

### 4. 전체 동시 실행 (개발용)
```bash
yarn dev
```

---

## 🛠️ VS Code 설정 (PnP 지원)
VS Code를 사용하신다면, 프로젝트를 열었을 때 우측 하단에 나타나는 **"Allow Workspace SDK"** 팝업을 반드시 허용해 주세요. 그래야만 PnP 환경에서도 타입 체크와 자동 완성이 정상적으로 작동합니다.

---

## 📁 데이터베이스 스키마

시스템은 다음의 핵심 엔티티를 포함하고 있습니다:
- **USER / RANK**: 사용자 및 직급 체계
- **PROJECT / ASSIGNMENT**: 프로젝트 및 인력 투입
- **EQUIPMENT**: 자산 관리
- **LEAVE_REQUEST**: 근태 및 휴가
- **SKILL_SET**: 기술 스택 데이터

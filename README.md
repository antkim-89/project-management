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

본 프로젝트는 **Yarn Berry (PnP)**를 패키지 매니저로 사용합니다. `node_modules` 대신 `.pnp.cjs`를 통한 효율적인 의존성 관리를 제공합니다.

### 0. Yarn Berry 설정 (환경별)

이 프로젝트는 `corepack`을 통해 Yarn 버전을 관리합니다. 설치 전 아래 설정을 먼저 진행해 주세요.

#### Windows
1. **관리자 권한**으로 PowerShell을 실행합니다.
2. Corepack을 활성화합니다:
   ```powershell
   corepack enable
   ```
3. 만약 스크립트 실행 권한 오류가 발생한다면 다음 명령어를 입력합니다:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

#### macOS / Linux
1. 터미널을 실행합니다.
2. Corepack을 활성화합니다 (필요시 `sudo` 사용):
   ```bash
   corepack enable
   ```

설정 후 `yarn -v` 명령어를 입력했을 때 `4.x.x` 버전이 출력되면 정상입니다.

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

본 프로젝트는 Yarn PnP를 사용하므로, VS Code에서 의존성을 정상적으로 인식하기 위해 아래 설정이 필요합니다.

1.  **SDK 허용**: 프로젝트를 열었을 때 우측 하단에 나타나는 **"Allow Workspace SDK"** 팝업을 반드시 허용해 주세요.
2.  **TypeScript 버전 선택**:
    - 프로젝트 내의 `.ts` 또는 `.tsx` 파일을 하나 엽니다.
    - `Ctrl + Shift + P` (Mac: `Cmd + Shift + P`)를 눌러 커맨드 팔레트를 엽니다.
    - **`TypeScript: Select TypeScript Version...`**을 검색하여 선택합니다.
    - **`Use Workspace Version`** (경로에 `.yarn/sdks` 포함됨)을 선택합니다.

이 설정을 완료해야만 타입 체크와 자동 완성이 정상적으로 작동합니다.

---

## 📁 데이터베이스 스키마

시스템은 다음의 핵심 엔티티를 포함하고 있습니다:
- **USER / RANK**: 사용자 및 직급 체계
- **PROJECT / ASSIGNMENT**: 프로젝트 및 인력 투입
- **EQUIPMENT**: 자산 관리
- **LEAVE_REQUEST**: 근태 및 휴가
- **SKILL_SET**: 기술 스택 데이터

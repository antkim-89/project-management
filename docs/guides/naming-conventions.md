# Naming Conventions (표기법 규칙)

이 프로젝트에서 사용하는 파일, 디렉토리, 변수 등의 명명 규칙입니다.

## 1. 파일 및 디렉토리 명명 규칙

- **디렉토리 (Directories)**: `kebab-case` 사용
  - 예: `front-end`, `back-end`, `components`, `layout`
- **React 컴포넌트 파일**: `PascalCase` 사용
  - 예: `BaseModal.tsx`, `GlassCard.tsx`, `Sidebar.tsx`
- **일반 TypeScript/JavaScript 파일**: `camelCase` 사용
  - 예: `main.tsx`, `routeTree.gen.ts`, `apiService.ts`
- **라우트 파일 (TanStack Router)**: `lowercase` 또는 `snake_case` (필요시) 사용
  - 예: `index.tsx`, `projects.tsx`, `teams.tsx`
- **스타일 파일 (CSS)**: `kebab-case` 또는 `camelCase` (CSS Modules 사용 시)
  - 예: `index.css`, `global.css`

## 2. 코드 내부 명명 규칙

- **변수 및 함수 (Variables & Functions)**: `camelCase` 사용
  - 예: `const projectData = ...;`, `function fetchData() { ... }`
- **상수 (Constants)**: `UPPER_SNAKE_CASE` 사용
  - 예: `const MAX_RETRY_COUNT = 3;`, `const API_URL = ...;`
- **클래스 및 인터페이스 (Classes & Interfaces)**: `PascalCase` 사용
  - 예: `class UserService { ... }`, `interface UserProfile { ... }`
- **타입 (Types)**: `PascalCase` 사용
  - 예: `type ProjectStatus = 'Active' | 'Completed';`
- **React Props**: `camelCase` 사용
  - 예: `<MyComponent userName="John" />`
- **Hooks**: `camelCase`이며 `use` 접두사 사용
  - 예: `useAuth`, `useProjectData`

## 3. API 및 데이터베이스 명명 규칙

- **API 엔드포인트**: `kebab-case` 사용
  - 예: `/api/v1/project-assignments`, `/api/v1/user-profiles`
- **데이터베이스 테이블**: `UPPER_SNAKE_CASE` 또는 `PascalCase` (Prisma 모델 기준)
  - 예: `USER`, `PROJECT_ASSIGNMENT` 또는 `User`, `ProjectAssignment`
- **데이터베이스 컬럼**: `camelCase` 또는 `snake_case` (프로젝트 설정에 따라 통일)
  - 현재 프로젝트는 Prisma 모델에서 `camelCase`를 권장합니다.

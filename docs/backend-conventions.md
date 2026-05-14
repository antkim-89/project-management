# Backend Code Conventions

백엔드(Node.js + Express + Prisma) 개발 시 준수해야 할 규칙입니다.

## 1. 아키텍처 구조

기본적으로 3-Layer Architecture를 지향합니다.

- **Controller**: 요청 수신 및 응답 반환, 입력값 검증 (DTO)
- **Service**: 핵심 비즈니스 로직 처리
- **Repository (Prisma)**: 데이터베이스 접근 및 쿼리 실행

## 2. 에러 핸들링 및 응답 규격

- 공통 응답 형식을 사용합니다:
  - 성공: `{ success: true, data: ... }`
  - 실패: `{ success: false, error: { message: "...", code: "..." } }`
- 전역 에러 핸들러(Middleware)를 통해 처리되지 않은 에러를 관리합니다.

## 3. Prisma ORM 사용

- `schema.prisma` 파일에 모델을 정의하고 `npx prisma generate`를 통해 타입을 생성합니다.
- 복잡한 쿼리는 Service 레이어에서 관리합니다.
- 데이터베이스 마이그레이션은 `npx prisma migrate dev`를 사용합니다.

## 4. 환경 변수 관리

- 민감한 정보(DB URL, API Key)는 `.env` 파일에 보관하고 절대 Git에 올리지 않습니다.
- `dotenv`를 사용하여 환경 변수를 로드합니다.

## 5. API 설계 (RESTful)

- 자원(Resource)은 명사형 복수를 사용합니다 (`/projects`, `/users`).
- HTTP Method를 목적에 맞게 사용합니다 (GET, POST, PUT, DELETE, PATCH).

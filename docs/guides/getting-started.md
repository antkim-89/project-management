# 시작하기 (Getting Started)

본 프로젝트는 **pnpm**을 패키지 매니저로 사용하는 모노레포 프로젝트입니다. 로컬 환경에서 프로젝트를 설치하고 실행하기 위한 가이드입니다.

---

## 1. 환경 설정 (Corepack)

이 프로젝트는 `corepack`을 통해 pnpm 버전을 관리합니다. 설치 전 아래 설정을 먼저 진행해 주세요.

### Windows (관리자 권한 PowerShell)
```powershell
corepack enable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### macOS / Linux (터미널)
```bash
corepack enable
```

---

## 2. 패키지 설치 및 DB 설정

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

### 💡 Prisma 명령어 실행 방법
백엔드의 데이터베이스 스키마나 마이그레이션 도구를 다룰 때 Prisma 명령어를 실행하는 두 가지 방법이 있습니다.

#### 방법 A. 최상위 루트 경로에서 실행 (권장)
루트 경로에 등록된 스크립트를 사용하여 간편하게 실행할 수 있습니다.
```bash
pnpm run prisma [명령어]

# 예시:
pnpm run prisma generate     # Prisma Client 생성
pnpm run prisma db push      # DB 스키마 동기화
pnpm run prisma db seed      # 초기 데이터 주입
pnpm run prisma studio       # Prisma Studio(GUI) 실행
```

#### 방법 B. 백엔드 폴더 내부에서 직접 실행
`back-end` 폴더 안으로 이동한 후 `pnpm prisma` 형태로 직접 명령어를 입력합니다.
```bash
cd back-end
pnpm prisma [명령어]

# 예시:
pnpm prisma generate
pnpm prisma db push
pnpm prisma studio
```

---

## 3. 프로젝트 실행

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

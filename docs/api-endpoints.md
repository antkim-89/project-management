# 주요 API 엔드포인트 (Backend)

백엔드 서버의 주요 API 엔드포인트 목록입니다.

- **기본 베이스 URL**: `http://localhost:4000`

---

## 1. 프로젝트 (Projects)

| HTTP 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| `GET` | `/projects` | 전체 프로젝트 목록 조회 (참여 인원, 카테고리, 요구 기술 포함) |
| `GET` | `/projects/:id` | 특정 프로젝트 상세 조회 |
| `POST` | `/projects` | 새 프로젝트 생성 (`totalManMonths`, `price`, `categoryId`, `requiredSkills` 추가 입력 가능) |
| `PUT` | `/projects/:id` | 프로젝트 정보 수정 (`totalManMonths`, `price`, `categoryId`, `requiredSkills` 수정 가능) |
| `DELETE` | `/projects/:id` | 프로젝트 삭제 |

---

## 2. 기술 스택 (Skill Sets)

| HTTP 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| `GET` | `/skill-sets` | 전체 기술 스택 마스터 목록 조회 |
| `POST` | `/skill-sets` | 새 기술 스택 등록 (`name`, `category` 필드 필요) |
| `DELETE` | `/skill-sets/:id` | 마스터 기술 스택 정보 삭제 |

---

## 3. 프로젝트 카테고리 (Project Categories)

| HTTP 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| `GET` | `/project-categories` | 등록된 프로젝트 카테고리(DevOps, SI, Infra 등) 목록 조회 |
| `POST` | `/project-categories` | 새 프로젝트 카테고리 등록 (`name` 필드 필요) |
| `DELETE` | `/project-categories/:id` | 카테고리 정보 삭제 |

---

## 4. 헬스체크 (Health Check)

| HTTP 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| `GET` | `/health` | 서버 상태 확인 및 헬스체크 |

